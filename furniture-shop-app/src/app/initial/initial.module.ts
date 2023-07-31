import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DebounceClickDirective } from './directives/debounce-click.directive';
import { LoadingDirective } from './directives/loading.directive';
import { CalcPricePipe } from './pipes/calc-price.pipe';
import { CalcRatingPipe } from './pipes/calc-rating.pipe';
import { DisplayArrowPipe } from './pipes/display-arrow.pipe';
import { FormatPricePipe } from './pipes/format-price.pipe';
import { FullNamePipe } from './pipes/full-name.pipe';
import { GetImageUrlPipe } from './pipes/get-image-url.pipe';
import { ProductSummaryPipe } from './pipes/product-summary.pipe';
import { RangeDisplayPipe } from './pipes/range-display.pipe';
import { ProductCardComponent } from './product-card/product-card.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { EmailDirective, UsernameDirective, NameDirective, SameValueDirective } from './validators';
import { PrimaryBtnComponent } from './primary-btn/primary-btn.component';



@NgModule({
  declarations: [
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
    DisplayArrowPipe,
    RangeDisplayPipe,
    FullNamePipe,
    CalcPricePipe,
    ProductSummaryPipe,
    SpinnerComponent,
    PrimaryBtnComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
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
    DisplayArrowPipe,
    RangeDisplayPipe,
    FullNamePipe,
    CalcPricePipe,
    ProductSummaryPipe,
    SpinnerComponent,
    PrimaryBtnComponent
  ]
})
export class InitialModule { }
