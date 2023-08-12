import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Subscription, tap } from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { CartService } from 'src/app/cart/services/cart.service';
import { ICartProduct, IProduct } from 'src/app/initial/interfaces';
import { FileUpload } from 'src/app/initial/constants';
import { Store } from '@ngrx/store';
import { getCart, getParams, isAdmin, isLoggedIn } from 'src/app/+store/selectors';
import { getProduct } from '../+store/selectors';
import { clearProduct, deleteProduct, loadProduct, setAvailable } from '../+store/actions/detailsActions';
import { updateCart } from 'src/app/+store/actions/cartActions';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  private sub = new Subscription();

  productId!: string;
  product: IProduct | null = null;
  isShown = false;

  product$ = this.store.select(getProduct);
  params$ = this.store.select(getParams);
  isLoggedIn$ = this.store.select(isLoggedIn);
  isAdmin$ = this.store.select(isAdmin);
  cartProducts$ = this.store.select(getCart);
  cart!: ICartProduct[] | null;

  availableQty!: number;
  isLoggedIn!: boolean;

  @ViewChild('cartForm') cartForm!: NgForm;

  constructor(
    private router: Router,
    private cartService: CartService,
    public modal: MatDialog,
    private store: Store,
  ) { }

  ngOnInit() {

    this.sub.add(this.isLoggedIn$.pipe(
      tap(v => this.isLoggedIn = v)
    ).subscribe());

    this.sub.add(this.params$.pipe(
      tap(params => {
        this.productId = params['id'];
        this.store.dispatch(loadProduct({ productId: this.productId, isLoggedIn: this.isLoggedIn }));
      })
    ).subscribe());

    this.sub.add(this.cartProducts$.pipe(
      tap(cart => {
        this.cart = cart;
        const currentProduct = this.cart?.find(p => p._id === this.productId);
        this.availableQty = (this.product?.quantity ?? 0) - (currentProduct?.count ?? 0);
      })
    ).subscribe());

    this.sub.add(this.product$.pipe(
      tap(p => {
        this.product = p;
        const currentProduct = this.cart?.find(p => p._id === this.productId);
        this.availableQty = (this.product?.quantity ?? 0) - (currentProduct?.count ?? 0);
      })
    ).subscribe());

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.store.dispatch(clearProduct());
  }

  editHandler(): void {
    this.router.navigate([`/admin/${this.productId}/edit-item`]);
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Delete product',
      text: `Are you sure that you want to delete ${this.product?.name}?`
    };

    const dialogRef = this.modal.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(deleteProduct({ productId: this.productId, images: this.product?.images as unknown as FileUpload[] }));
      }

    });
  }

  availabilityHandler(event: MouseEvent) {
    this.store.dispatch(setAvailable({ productId: this.productId, deleted: !this.product?.deleted ? true : false, event }));
  }

  toggle() {
    this.isShown = !this.isShown;
  }

  cartHandler() {

    if (this.cartForm.invalid) {

      if (this.cartForm.value.quantity > this.availableQty) {
        this.cartForm.setValue({ quantity: this.availableQty });
      }
      return;
    }

    let { quantity: count } = this.cartForm.value;

    if (count % 1 !== 0) {
      count = Math.round(count);
    }

    const imageUrl = this.product!.images![0].url;

    const cart = count > 0 && this.cartService.addToCart({ _id: this.product!._id, count, imageUrl, name: this.product!.name, price: this.product?.discountPrice });
    cart && this.store.dispatch(updateCart({ cart }));
    this.cartForm.resetForm({ quantity: 1 });
  }
}