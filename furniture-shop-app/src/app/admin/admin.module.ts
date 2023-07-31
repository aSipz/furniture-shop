import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadImagesComponent } from './upload-images/upload-images.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { CustomersOrdersComponent } from './customers-orders/customers-orders.component';
import { InitialModule } from '../initial/initial.module';



@NgModule({
  declarations: [
    AddNewItemComponent,
    UploadImagesComponent,
    EditItemComponent,
    CustomersOrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    InitialModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
