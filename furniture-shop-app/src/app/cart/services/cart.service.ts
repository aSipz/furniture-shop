import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { ICartProduct } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/user/user.service';
import { LocalDataService } from 'src/app/core/services/local-data.service';


@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {

  private cart$$ = new BehaviorSubject<ICartProduct[] | null>(null);
  cart$ = this.cart$$.asObservable();

  cart: ICartProduct[] | null = null;
  sub: Subscription;

  get user() {
    return this.userService.user;
  }

  constructor(
    private userService: UserService,
    private localDataService: LocalDataService
  ) {
    this.sub = this.cart$.subscribe(cart => this.cart = cart);
  }

  getCart() {
    this.user
      ? this.cart$$.next(this.localDataService.getData('cart') as ICartProduct[] | null)
      : this.cart$$.next(null);
  }

  addToCart(product: ICartProduct) {
    let newCart: ICartProduct[] = [];
    if (this.cart) {
      newCart = JSON.parse(JSON.stringify(this.cart));
      const cartProduct = newCart.find(p => p._id === product._id);
      if (cartProduct) {
        cartProduct.count += product.count;
      } else {
        newCart.push(product);
      }
    } else {
      newCart.push(product);
    }

    this.cart$$.next(newCart);
    this.localDataService.saveData('cart', newCart);
  }

  updateCart(product: ICartProduct) {
    const newCart = (JSON.parse(JSON.stringify(this.cart as ICartProduct[])) as ICartProduct[])
      .map(p => {
        if (p._id === product._id) {
          p.count = product.count;
        };
        return p;
      })
      .filter(p => p.count > 0);

    this.cart$$.next(newCart.length > 0 ? newCart : null);
    this.localDataService.saveData('cart', newCart.length > 0 ? newCart : null);
  }

  clearCart() {
    this.cart$$.next(null);
    this.localDataService.removeData('cart');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}