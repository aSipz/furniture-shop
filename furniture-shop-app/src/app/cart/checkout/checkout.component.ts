import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { LoaderService } from 'src/app/core/services/loader.service';
import { emailValidator, nameValidator, phoneValidator } from 'src/app/shared/validators';
import { UserService } from 'src/app/user/user.service';
import { CartService } from '../services/cart.service';
import { ProductsService } from 'src/app/products/services/products.service';
import { IProduct } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  serverError = '';

  private sub!: Subscription;
  cartTotal: number = 0;
  products: (IProduct & { cartCount: number, error: boolean })[] | null = null;

  billingForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    firstName: ['', [Validators.required, nameValidator()]],
    lastName: ['', [Validators.required, nameValidator()]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, phoneValidator()]],
    notes: [''],
    saveAddress: [false]
  });

  get user() {
    return this.userService.user;
  }

  get cart() {
    return this.cartService.cart;
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService,
    private cartService: CartService,
    private productService: ProductsService,
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

    this.loaderService.showLoader();

    this.billingForm.disable();

    // const { username, email, firstName, lastName, passGroup: { pass: password, oldPass: oldPassword } } = this.billingForm.value;
    // this.sub = this.userService.updateProfile(username!, email!, firstName!, lastName!, password ? password : null, oldPassword ? oldPassword : null)
    //   .subscribe({
    //     next: () => {
    //       this.router.navigate(['/user/profile']);
    //       this.loaderService.hideLoader();
    //     },
    //     error: err => {
    //       console.log(err);
    //       this.serverError = err.error?.message;
    //       this.billingForm.enable();
    //       this.loaderService.hideLoader();
    //     }

    //   });

  }
}