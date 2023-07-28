import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { pairwise, tap, startWith } from 'rxjs';

import { CartService } from 'src/app/cart/services/cart.service';
import { ProductsService } from 'src/app/products/services/products.service';
import { IProduct, ICartProduct } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-cart-submenu',
  templateUrl: './cart-submenu.component.html',
  styleUrls: ['./cart-submenu.component.css']
})
export class CartSubmenuComponent implements OnDestroy {

  products: (IProduct & { cartCount: number })[] | null = null;
  cart: ICartProduct[] | null = null;
  cartTotal: number = 0;
  differenceIndex: number[] | null = null;
  timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private cartService: CartService,
    private productService: ProductsService,
    private router: Router,
  ) {
    this.cartService.cart$.pipe(
      // startWith(null),
      // pairwise(),
      tap(cart => {

        // this.compareCarts(oldCart, cart);

        this.cart = cart;
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
          },
          error: (err) => {
            console.log(err);
          }
        });
      })
    ).subscribe()
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.differenceIndex = null;

  }

  removeProduct(productId: string) {
    this.cartService.updateCart({ _id: productId, count: 0 });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  compareCarts(oldCart: ICartProduct[] | null, newCart: ICartProduct[] | null) {
    if (!oldCart && newCart) {
      this.differenceIndex = newCart?.map((e, i) => i);
      this.timer = setTimeout(() => {
        this.differenceIndex = null;
      }, 2000);
      return;
    }

    if (newCart) {
      newCart.forEach((p, i) => {

        if (!oldCart?.some(e => e._id === p._id)) {
          this.differenceIndex?.push(i);
        } else {
          oldCart.find(e => e._id === p._id)?.count !== p.count && this.differenceIndex?.push(i);
        }
      });
    }
    this.timer = setTimeout(() => {
      this.differenceIndex = null;
    }, 2000);
    return;
  }
}
