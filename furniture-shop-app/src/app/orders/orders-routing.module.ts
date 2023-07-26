import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MyOrdersComponent,
    data: {
      title: 'My Orders',
      animation: 'myOrdersPage'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
