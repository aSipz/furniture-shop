import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { OrdersService } from '../services/orders.service';
import { UserService } from 'src/app/user/user.service';
import { IOrder } from 'src/app/shared/interfaces';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ordersPageSize } from 'src/app/shared/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnDestroy, OnInit {

  orders: IOrder[] = [];
  pages!: number;
  pageSize = ordersPageSize;
  private sub!: Subscription;
  errorFetchingData = false;

  get user() {
    return this.userService.user;
  }

  constructor(
    private ordersService: OrdersService,
    private userService: UserService,
    public modal: MatDialog,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(query => {
      const changedQuery = JSON.parse(JSON.stringify(query));

      this.loaderService.showLoader();

      if (!query['skip']) {
        changedQuery['skip'] = 0;
        changedQuery['limit'] = this.pageSize;
      }

      if (!query['search']) {
        changedQuery['search'] = { ownerId: this.user!._id };
      } else {
        const search = JSON.parse(changedQuery['search']);
        search.ownerId = this.user!._id;
        changedQuery['search'] = search;
      }

      changedQuery['include'] = 'products.productId';

      if (!query['sort']) {
        changedQuery['sort'] = '-createdAt';
      }

      this.ordersService.getOrders(changedQuery).subscribe({
        next: value => {
          this.orders = value.result;
          this.pages = Math.ceil(value.count / this.pageSize);
          this.loaderService.hideLoader();
        },
        error: err => {
          this.errorFetchingData = true;
          console.log(err);
          this.loaderService.hideLoader();
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openModal(orderId: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Cancel order',
      text: `Are you sure that you want to cancel order ${orderId}?`
    };

    const dialogRef = this.modal.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loaderService.showLoader();
        this.ordersService.changeOrderStatus(orderId, 'Canceled')
          .subscribe({
            next: () => {
              this.loaderService.hideLoader();
              this.orders = this.orders.map(o => o._id === orderId ? { ...o, status: 'Canceled' } : o);
            },
            error: (err) => {
              console.log(err);
              this.loaderService.hideLoader();
            }
          });
      }
    });
  }
}
