import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { CustomersOrdersComponent } from './customers-orders/customers-orders.component';

const routes: Routes = [
  {
    path: 'add-item',
    component: AddNewItemComponent,
    data: {
      title: 'Add New Product',
      animation: 'addItemPage'
    }
  },
  {
    path: ':id/edit-item',
    component: EditItemComponent,
    data: {
      title: 'Edit Product',
      animation: 'editPage'
    }
  },
  {
    path: 'orders',
    component: CustomersOrdersComponent,
    data: {
      title: 'Orders',
      animation: 'ordersPage'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
