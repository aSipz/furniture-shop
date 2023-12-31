import { Component, Input } from '@angular/core';

import { IProduct } from '../interfaces';
import { CartService } from 'src/app/cart/services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  private _product!: IProduct;

  @Input() set product(value: IProduct) {
    this._product = value;
  };

  get product(): IProduct {
    return this._product;
  }

  get cartProduct() {
    return this.cartService.cart?.find(p => p._id === this.product._id);
  }

  get availableQty() {
    return (this.product?.quantity ?? 0) - (this.cartProduct?.count ?? 0);
  }

  constructor(private cartService: CartService) { }

  addToCart() {
    const imageUrl = this.product!.images![0].url;
    this.cartService.addToCart({ _id: this.product._id, count: 1, imageUrl, name: this.product!.name, price: this.product?.discountPrice });
  }
}
