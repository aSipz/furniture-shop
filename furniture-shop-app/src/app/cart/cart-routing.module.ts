import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { checkoutActivate } from '../shared/guards/checkout.activate';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CartComponent,
    data: {
      title: 'Cart',
      animation: 'cartPage'
    }
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [checkoutActivate],
    data: {
      title: 'Checkout',
      animation: 'checkoutPage'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
