import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { UploadListComponent } from './upload-list/upload-list.component';
import { UploadDetailsComponent } from './upload-details/upload-details.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';



@NgModule({
  declarations: [
    AddNewItemComponent,
    UploadFormComponent,
    UploadListComponent,
    UploadDetailsComponent,
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
