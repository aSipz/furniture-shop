import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateCart } from 'src/app/+store/actions/cartActions';

import { CartService } from 'src/app/cart/services/cart.service';
import { ICartProduct } from 'src/app/initial/interfaces';

@Component({
  selector: 'app-cart-submenu',
  templateUrl: './cart-submenu.component.html',
  styleUrls: ['./cart-submenu.component.css']
})
export class CartSubmenuComponent implements OnChanges {

  @Input() cart!: [ICartProduct[] | null, ICartProduct[] | null];
  @Input() newEntry!: boolean;

  differenceIndex: number[] = [];

  get cartTotal(): number {
    if (this.cart[1] && this.cart[1].length > 0) {
      return this.cart[1].reduce((acc, curr) => acc += (curr.price! * curr.count), 0);
    }

    return 0;
  }

  constructor(
    private cartService: CartService,
    private router: Router,
    private store: Store,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const currentCart: SimpleChange = changes['cart'];
    const newEntry: SimpleChange = changes['newEntry'];

    if (currentCart?.currentValue) {
      this.cart = currentCart.currentValue;
      this.compareCarts(this.cart[0], this.cart[1]);
    }

    if (newEntry?.currentValue === false) {
      this.differenceIndex = [];
    }

  }

  removeProduct(productId: string) {
    const cart = this.cartService.updateCart({ _id: productId, count: 0 });
    this.store.dispatch(updateCart({ cart }));
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  compareCarts(oldCart: ICartProduct[] | undefined | null, newCart: ICartProduct[] | undefined | null) {

    if (!oldCart && newCart) {
      this.differenceIndex = newCart?.map((e, i) => i);
      return;
    }

    this.differenceIndex = [];

    if (newCart) {
      newCart.forEach((p, i) => {
        if (!oldCart?.some(e => e._id === p._id)) {
          this.differenceIndex.push(i);
        } else {
          oldCart.find(e => e._id === p._id)?.count !== p.count && this.differenceIndex.push(i);
        }
      });
    }
    return;
  }
}
