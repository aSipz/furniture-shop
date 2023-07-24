import { Component, Input } from '@angular/core';
import { IProduct } from '../interfaces';
import { CartService } from 'src/app/cart/services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input() product!: IProduct;

  get availableQty() {
    return this.product.quantity - (this.cartProduct?.count ?? 0);
  }

  get cartProduct() {
    return this.cartService.cart?.find(p => p._id === this.product._id);
  }

  constructor(private cartService: CartService) { }

  addToCart() {
    this.cartService.addToCart({ _id: this.product._id, count: 1 });
  }
}
