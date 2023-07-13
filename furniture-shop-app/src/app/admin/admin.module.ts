import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadImagesComponent } from './upload-images/upload-images.component';



@NgModule({
  declarations: [
    AddNewItemComponent,
    UploadImagesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
