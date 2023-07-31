import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrdersSearchBarComponent } from './orders-search-bar/orders-search-bar.component';
import { InitialModule } from '../initial/initial.module';



@NgModule({
  declarations: [
    SearchBarComponent,
    PaginationComponent,
    OrdersSearchBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InitialModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  exports: [
    SearchBarComponent,
    PaginationComponent,
    OrdersSearchBarComponent,
  ]
})
export class SharedModule { }
