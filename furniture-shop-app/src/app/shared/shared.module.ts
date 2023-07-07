import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryBtnComponent } from './primary-btn/primary-btn.component';
import { EmailDirective, NameDirective, SameValueDirective, UsernameDirective } from './validators';



@NgModule({
  declarations: [
    PrimaryBtnComponent,
    EmailDirective,
    UsernameDirective,
    NameDirective,
    SameValueDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrimaryBtnComponent,
    EmailDirective,
    UsernameDirective,
    NameDirective,
    SameValueDirective
  ]
})
export class SharedModule { }
