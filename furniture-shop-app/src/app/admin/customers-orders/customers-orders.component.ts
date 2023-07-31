import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ModalComponent } from 'src/app/core/modal/modal.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { orderStatus, ordersPageSize } from 'src/app/initial/constants';
import { IOrder } from 'src/app/initial/interfaces';
import { OrdersService } from 'src/app/orders/services/orders.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-customers-orders',
  templateUrl: './customers-orders.component.html',
  styleUrls: ['./customers-orders.component.css']
})
export class CustomersOrdersComponent {

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

      if (query['search']) {
        const search = JSON.parse(changedQuery['search']);
        changedQuery['search'] = search;
      }

      if (!query['skip']) {
        changedQuery['skip'] = 0;
        changedQuery['limit'] = this.pageSize;
      }

      changedQuery['include'] = 'products.productId';

      if (!query['sort']) {
        changedQuery['sort'] = '-createdAt';
      }

      this.ordersService.getOrders(changedQuery).subscribe({
        next: value => {
          this.loaderService.hideLoader();
          this.orders = value.result;
          this.pages = Math.ceil(value.count / this.pageSize);
        },
        error: err => {
          this.loaderService.hideLoader();
          this.errorFetchingData = true;
          console.log(err);
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openModal(order: IOrder) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Change order status',
      text: `Are you sure that you want to change order ${order._id} status?`,
      statusOptions: orderStatus.filter(o => o !== order.status),
    };

    const dialogRef = this.modal.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loaderService.showLoader();
        this.ordersService.changeOrderStatus(order._id, result)
          .subscribe({
            next: () => {
              this.loaderService.hideLoader();
              this.orders = this.orders.map(o => o._id === order._id ? { ...o, status: result } : o);
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
