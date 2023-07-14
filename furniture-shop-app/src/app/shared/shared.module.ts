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
    GetImageUrlPipe
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
    GetImageUrlPipe
  ]
})
export class SharedModule { }
