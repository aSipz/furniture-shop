import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryBtnComponent } from './primary-btn/primary-btn.component';
import { EmailDirective, NameDirective, SameValueDirective, UsernameDirective } from './validators';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    PrimaryBtnComponent,
    EmailDirective,
    UsernameDirective,
    NameDirective,
    SameValueDirective,
    LoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrimaryBtnComponent,
    LoaderComponent,
    EmailDirective,
    UsernameDirective,
    NameDirective,
    SameValueDirective
  ]
})
export class SharedModule { }
