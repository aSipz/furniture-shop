import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { LoaderService } from 'src/app/core/services/loader.service';
import { emailValidator, nameValidator, phoneValidator } from 'src/app/shared/validators';
import { UserService } from 'src/app/user/user.service';
import { CartService } from '../services/cart.service';
import { ProductsService } from 'src/app/products/services/products.service';
import { IProduct } from 'src/app/shared/interfaces';
import { OrdersService } from 'src/app/orders/services/orders.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  serverError = '';
  orderReceived = false;

  cartTotal: number = 0;
  products: (IProduct & { cartCount: number, error: boolean })[] | null = null;

  billingForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    firstName: ['', [Validators.required, nameValidator()]],
    lastName: ['', [Validators.required, nameValidator()]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, phoneValidator()]],
    notes: [''],
  });

  get user() {
    return this.userService.user;
  }

  get cart() {
    return this.cartService.cart;
  }

  get quantityErr() {
    return this.products?.some(p => p.error);
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loaderService: LoaderService,
    private cartService: CartService,
    private productService: ProductsService,
    private orderService: OrdersService,
  ) {

    this.productService.getProducts({ search: { _id: { $in: this.cart?.map(p => p._id) } } }).subscribe({
      next: (value) => {
        const cartProducts = value.result
          .map(p => ({
            ...p,
            cartCount: this.cart?.find(e => e._id === p._id)?.count ?? 0,
            error: (this.cart?.find(e => e._id === p._id)?.count ?? 0) > p.quantity
          }));
        this.products = cartProducts;
        this.cartTotal = cartProducts.reduce((acc, curr) => acc += (curr.discountPrice! * curr.cartCount), 0);
      },
      error: (err) => {
        console.log(err);
      }
    });

    const { email, firstName, lastName } = this.user!;

    this.billingForm.patchValue({ email, firstName, lastName });

  }

  submitHandler(): void {

    if (this.billingForm.invalid) {
      return;
    }

    if (this.quantityErr) {
      return;
    }

    this.loaderService.showLoader();

    this.billingForm.disable();

    const { firstName, lastName, email, phone, address, notes } = this.billingForm.value;

    this.orderService.newOrder(firstName!, lastName!, email!, phone!, address!, notes!, this.cartTotal, this.products!.map(p => ({ productId: p._id, count: p.cartCount })))
      .subscribe({
        next: () => {
          this.cartService.clearCart();
          this.loaderService.hideLoader();
          this.orderReceived = true;
        },
        error: (err) => {
          console.log(err);
          this.serverError = err.error?.message;
          this.billingForm.enable();
          this.loaderService.hideLoader();
        }
      });

  }
}