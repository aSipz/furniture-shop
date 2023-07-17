import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryBtnComponent } from './primary-btn/primary-btn.component';
import { EmailDirective, NameDirective, SameValueDirective, UsernameDirective } from './validators';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingDirective } from './directives/loading.directive';
import { ProductCardComponent } from './product-card/product-card.component';
import { RouterModule } from '@angular/router';
import { FormatPricePipe } from './pipes/format-price.pipe';
import { GetImageUrlPipe } from './pipes/get-image-url.pipe';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { CalcRatingPipe } from './pipes/calc-rating.pipe';
import { SearchBarComponent } from './search-bar/search-bar.component';



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
  ],
  imports: [
    CommonModule,
    RouterModule
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
    SearchBarComponent
  ]
})
export class SharedModule { }
