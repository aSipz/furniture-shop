import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule
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
    CalcPricePipe
  ]
})
export class SharedModule { }
