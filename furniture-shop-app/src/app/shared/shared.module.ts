import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PrimaryBtnComponent } from './primary-btn/primary-btn.component';
import { EmailDirective, NameDirective, SameValueDirective, UsernameDirective } from './validators';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingDirective } from './directives/loading.directive';
import { ProductCardComponent } from './product-card/product-card.component';
import { FormatPricePipe } from './pipes/format-price.pipe';
import { GetImageUrlPipe } from './pipes/get-image-url.pipe';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { CalcRatingPipe } from './pipes/calc-rating.pipe';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { DisplayArrowPipe } from './pipes/display-arrow.pipe';
import { RangeDisplayPipe } from './pipes/range-display.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullNamePipe } from './pipes/full-name.pipe';
import { CalcPricePipe } from './pipes/calc-price.pipe';
import { ProductSummaryPipe } from './pipes/product-summary.pipe';
import { OrdersSearchBarComponent } from './orders-search-bar/orders-search-bar.component';



@NgModule({
  declarations: [
    PrimaryBtnComponent,
    EmailDirective,
    UsernameDirective,
    NameDirective,
    SameValueDirective,
    SpinnerComponent,
    LoadingDirective,
    ProductCardComponent,
    FormatPricePipe,
    GetImageUrlPipe,
    DebounceClickDirective,
    CalcRatingPipe,
    SearchBarComponent,
    DisplayArrowPipe,
    RangeDisplayPipe,
    PaginationComponent,
    FullNamePipe,
    CalcPricePipe,
    ProductSummaryPipe,
    OrdersSearchBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  exports: [
    PrimaryBtnComponent,
    SpinnerComponent,
    EmailDirective,
    UsernameDirective,
    NameDirective,
    SameValueDirective,
    LoadingDirective,
    ProductCardComponent,
    FormatPricePipe,
    GetImageUrlPipe,
    DebounceClickDirective,
    CalcRatingPipe,
    SearchBarComponent,
    DisplayArrowPipe,
    RangeDisplayPipe,
    PaginationComponent,
    FullNamePipe,
    CalcPricePipe,
    ProductSummaryPipe,
    OrdersSearchBarComponent,
  ]
})
export class SharedModule { }
