import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { tap, Subscription } from 'rxjs';

import { CartService } from '../services/cart.service';
import { ProductsService } from 'src/app/products/services/products.service';
import { ICartProduct, IProduct } from 'src/app/shared/interfaces';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnDestroy {

  products: (IProduct & { cartCount: number })[] | null = null;
  cart: ICartProduct[] | null = null;
  sub: Subscription;
  cartForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private productService: ProductsService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.sub = this.cartService.cart$.pipe(
      tap((cart) => {
        this.cart = cart;
        // this.createForm({ products: cart });
        this.productService.getProducts({ search: { _id: { $in: cart ? cart?.map(p => p._id) : [] } } }).subscribe({
          next: (value) => {
            const cartProducts = value.result.map(p => ({ ...p, cartCount: cart?.find(e => e._id === p._id)?.count ?? 0 }));
            this.products = cartProducts
            this.createForm({ products: cartProducts });
          },
          error: (err) => {
            console.log(err)
          }
        });
      })
    ).subscribe()

  }

  goToShop() {
    this.router.navigate(['/products']);
  }

  goToCheckout() {
    this.router.navigate(['/cart/checkout']);
  }

  removeProduct(productId: string) {
    this.cartService.removeFromCart({ _id: productId, count: this.cart?.find(p => p._id === productId)?.count ?? 0 });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createForm(formValue: any) {
    console.log(formValue);
    
    this.cartForm = this.fb.group({
      products: this.fb.array(
        new Array(this.products?.length).fill(null).map((_, i) => {
          return this.fb.group({
            count: formValue.products[i]?.cartCount || 0,
          })
        })
      )
    })

    console.log(this.cartForm);
    console.log(this.productsArray);
    
    
  }

  get productsArray() {
    return (this.cartForm.get('products') as FormArray);
  }


  // get addresssesArray() {
  //   return (this.form.get('addresses') as FormArray);
  // }

  // form!: FormGroup;

  // constructor(private fb: FormBuilder, private authServie: AuthService) {
  //   this.createForm({ ...this.user, addresses: [{ postCode: 'Hello', street: 'World' }] });
  // }

  // createForm(formValue: any) {
  //   this.form = this.fb.group({
  //     username: [formValue.username, [Validators.required, Validators.minLength(5)]],
  //     email: [formValue.email, [Validators.required, appEmailValidator(appEmailDomains)]],
  //     ext: [formValue.ext],
  //     tel: [formValue.tel],
  //     addresses: this.fb.array(
  //       new Array(this.counter).fill(null).map((_, i) => {
  //         return this.fb.group({
  //           postCode: formValue.addresses[i]?.postCode || '',
  //           street: formValue.addresses[i]?.street || ''
  //         })
  //       })
  //     )
  //   })

  // }

  // addNewAddress(): void {
  //   this.counter++;
  //   this.createForm(this.form.value);
  // }

  submitHandler() {
    console.log(this.cartForm);

  }
}
