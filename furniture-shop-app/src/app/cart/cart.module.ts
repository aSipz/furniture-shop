import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { CartRoutingModule } from './cart-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderReceivedComponent } from './order-received/order-received.component';
import { InitialModule } from '../initial/initial.module';



@NgModule({
  declarations: [
    CartComponent,
    CheckoutComponent,
    OrderReceivedComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SharedModule,
    InitialModule,
    ReactiveFormsModule,
  ]
})
export class CartModule { }
