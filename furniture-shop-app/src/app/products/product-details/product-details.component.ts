import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Subscription, tap } from 'rxjs';

import { UserService } from 'src/app/user/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { CartService } from 'src/app/cart/services/cart.service';
import { IProduct } from 'src/app/initial/interfaces';
import { FileUpload } from 'src/app/initial/constants';
import { Store } from '@ngrx/store';
import { getParams } from 'src/app/+store/selectors';
import { getProduct } from '../+store/selectors';
import { clearProduct, deleteProduct, loadProduct, setAvailable } from '../+store/actions';



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

  @ViewChild('cartForm') cartForm!: NgForm;

  get isAdmin() {
    return this.userService.isAdmin;
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get cartProduct() {
    return this.cartService.cart?.find(p => p._id === this.product?._id);
  }

  get availableQty() {
    return (this.product?.quantity ?? 0) - (this.cartProduct?.count ?? 0);
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private cartService: CartService,
    public modal: MatDialog,
    private store: Store,
  ) { }

  ngOnInit() {

    this.sub.add(this.params$.subscribe(params => {
      this.productId = params['id'];
      this.store.dispatch(loadProduct({ productId: this.productId, isLoggedIn: this.isLoggedIn }));
    }));

    this.sub.add(this.product$.pipe(
      tap(p => this.product = p)
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

    count > 0 && this.cartService.addToCart({ _id: this.product!._id, count, imageUrl, name: this.product!.name, price: this.product?.discountPrice });
    this.cartForm.resetForm({ quantity: 1 });
  }
}