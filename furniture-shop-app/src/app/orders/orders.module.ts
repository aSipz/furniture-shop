import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MyOrdersComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    RouterModule
  ]
})
export class OrdersModule { }
