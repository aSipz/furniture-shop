import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { OrdersService } from '../services/orders.service';
import { UserService } from 'src/app/user/user.service';
import { IOrder } from 'src/app/shared/interfaces';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {

  orders: IOrder[] = [];

  get user() {
    return this.userService.user;
  }

  constructor(
    private ordersService: OrdersService,
    private userService: UserService,
    public modal: MatDialog,
    private loaderService: LoaderService
  ) {
    this.ordersService.getOrdersByUserId(this.user!._id).subscribe({
      next: (value) => {
        this.orders = value.result;
        console.log(value);
      },
      error: (err) => {
        console.log(err);
      }
    })

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
