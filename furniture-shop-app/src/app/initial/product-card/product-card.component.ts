import { Component, Input, OnDestroy, AfterContentInit } from '@angular/core';

import { IProduct } from '../interfaces';
import { CartService } from 'src/app/cart/services/cart.service';
import { Store } from '@ngrx/store';
import { updateCart } from 'src/app/+store/actions/cartActions';
import { getCart } from 'src/app/+store/selectors';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnDestroy, AfterContentInit {

  private _product!: IProduct;

  @Input() set product(value: IProduct) {
    this._product = value;
  };

  get product(): IProduct {
    return this._product;
  }

  private sub = new Subscription();

  cartProducts$ = this.store.select(getCart);
  availableQty!: number;

  constructor(
    private cartService: CartService,
    private store: Store,
  ) { }

  ngAfterContentInit(): void {
    this.sub.add(this.cartProducts$.pipe(
      tap(cart => {
        const currentProduct = cart?.find(p => p._id === this.product._id);
        this.availableQty = (this.product?.quantity ?? 0) - (currentProduct?.count ?? 0);
      })
    ).subscribe())
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addToCart() {
    const imageUrl = this.product!.images![0].url;
    const cart = this.cartService.addToCart({ _id: this.product._id, count: 1, imageUrl, name: this.product!.name, price: this.product?.discountPrice });
    this.store.dispatch(updateCart({ cart }));
  }
}
