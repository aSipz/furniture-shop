import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';

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
    path: ':id/edit',
    component: AddNewItemComponent,
    data: {
      title: 'Edit Product',
      animation: 'editPage'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
