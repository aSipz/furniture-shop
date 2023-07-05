import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryBtnComponent } from './primary-btn/primary-btn.component';



@NgModule({
  declarations: [
    PrimaryBtnComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrimaryBtnComponent
  ]
})
export class SharedModule { }
