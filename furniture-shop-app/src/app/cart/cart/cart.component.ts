import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { tap, Subscription, } from 'rxjs';

import { CartService } from '../services/cart.service';
import { ProductsService } from 'src/app/products/services/products.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ICartProduct, IProduct } from 'src/app/initial/interfaces';

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
  cartTotal: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductsService,
    private router: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.loaderService.showLoader();
    this.sub = this.cartService.cart$.pipe(
      tap((cart) => {
        this.cart = cart;
        this.createForm({ products: [] });
        this.productService.getProducts({ search: { _id: { $in: cart ? cart?.map(p => p._id) : [] } } }).subscribe({
          next: (value) => {
            const cartProducts = value.result
              .map(p => ({ ...p, cartCount: cart?.find(e => e._id === p._id)?.count ?? 0 }))
              .map(p => {
                if (p.cartCount > p.quantity) {
                  p.cartCount = p.quantity;
                }
                return p;
              });
            this.products = cartProducts;
            this.cartTotal = cartProducts.reduce((acc, curr) => acc += (curr.discountPrice! * curr.cartCount), 0);
            this.createForm({ products: cartProducts });
            this.loaderService.hideLoader();
          },
          error: (err) => {
            console.log(err);
            loaderService.hideLoader();
          }
        });
      })
    ).subscribe()

  }

  updateCount(index: number, productId: string) {
    const currentFormGroup = this.productsFormArray.at(index) as FormGroup;

    let count = currentFormGroup.controls['count'].value;

    if (count > this.products?.find(p => p._id === productId)?.quantity!) {
      count = this.products?.find(p => p._id === productId)?.quantity;
      currentFormGroup.controls['count'].setValue = count as any;
    }

    if (count % 1 !== 0) {
      count = Math.round(count);
      currentFormGroup.controls['count'].setValue = count as any;
    }

    this.cartService.updateCart({ _id: productId, count });

  }

  goToShop() {
    this.updateCart();
    this.router.navigate(['/products']);
  }

  goToCheckout() {
    this.updateCart();
    this.router.navigate(['/cart/checkout']);
  }

  removeProduct(productId: string) {
    this.cartService.updateCart({ _id: productId, count: 0 });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createForm(formValue: any) {
    this.cartForm = this.fb.group({
      products: this.fb.array(
        new Array(this.products?.length).fill(null).map((_, i) => {
          return this.fb.group({
            count: [formValue.products[i]?.cartCount || 0],
          })
        })
      )
    });
  }

  get productsFormArray() {
    return (this.cartForm.get('products') as FormArray);
  }

  updateCart() {
    this.products?.forEach(p => {
      this.cartService.updateCart({ _id: p._id, count: p.cartCount });
    });
  }
}
