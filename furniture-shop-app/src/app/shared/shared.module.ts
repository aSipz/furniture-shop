import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryBtnComponent } from './primary-btn/primary-btn.component';
import { EmailDirective, SameValueDirective } from './validators';



@NgModule({
  declarations: [
    PrimaryBtnComponent,
    EmailDirective,
    SameValueDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrimaryBtnComponent,
    EmailDirective,
    SameValueDirective
  ]
})
export class SharedModule { }
