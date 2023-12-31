import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Subject, Subscription, debounceTime, distinctUntilChanged, forkJoin, mergeMap, of, switchMap } from 'rxjs';


import { ProductsService } from '../services/products.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UserService } from 'src/app/user/user.service';
import { FileUploadService } from 'src/app/admin/services/file-upload.service';
import { RatingService } from '../services/rating.service';
import { FavoritesService } from '../services/favorites.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { CartService } from 'src/app/cart/services/cart.service';
import { IFavorite, IProduct, IRating } from 'src/app/initial/interfaces';
import { FileUpload } from 'src/app/initial/constants';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  private sub!: Subscription;
  private userRating$$ = new Subject<number>();
  private userFavorite$$ = new Subject<boolean>();

  productId!: string;
  product: IProduct | null = null;
  favorite: IFavorite | null = null;
  isShown = false;

  @ViewChild('cartForm') cartForm!: NgForm;

  get isAdmin() {
    return this.userService.isAdmin;
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get isAvailable() {
    return !this.product?.deleted;
  }

  get cartProduct() {
    return this.cartService.cart?.find(p => p._id === this.product?._id);
  }

  get availableQty() {
    return (this.product?.quantity ?? 0) - (this.cartProduct?.count ?? 0);
  }

  constructor(
    private productsService: ProductsService,
    private ratingService: RatingService,
    private favoritesService: FavoritesService,
    private userService: UserService,
    private loaderService: LoaderService,
    private imageService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    public modal: MatDialog
  ) {
    this.loaderService.showLoader();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];

      forkJoin([
        this.productsService.getProduct(this.productId, { include: 'ratings' }),
        this.isLoggedIn
          ? this.favoritesService.getFavorite(this.productId)
          : of(null)
      ]).subscribe({
        next: (value) => {
          this.product = value[0];
          this.favorite = value[1];
          this.loaderService.hideLoader();
        },
        error: (err) => {
          console.log(err);
          this.loaderService.hideLoader();
          this.router.navigate(['/']);
        }
      })
    });

    this.userRating$$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(rating => this.ratingService.rate(this.productId, rating))
    ).subscribe({
      next: (value) => {
        const ratings = [...this.product?.ratings as IRating[]];
        const existingRating = ratings.find(r => r._id === value._id);
        existingRating
          ? existingRating.rating = value.rating
          : ratings.push(value);

        this.product!.ratings = ratings;

      },
      error: err => console.log(err)
    });

    this.userFavorite$$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(favorite => {
        if (favorite) {
          return this.favoritesService.addFavorite(this.productId);
        }

        return this.favoritesService.deleteFavorite(this.productId);
      })
    ).subscribe({
      next: (value) => {

        const fav = value as IFavorite | null;
        this.favorite = fav;

      },
      error: err => console.log(err)
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
        this.loaderService.showLoader();

        const images = this.product?.images as unknown as FileUpload[];
        this.productsService.deleteProduct(this.productId).pipe(
          mergeMap(() => forkJoin(images.map(i => this.imageService.deleteFileStorage(i))))
        ).subscribe({
          next: () => {
            this.router.navigate(['/']);
            this.loaderService.hideLoader();
          },
          error: (err) => {
            console.log(err);
            this.loaderService.hideLoader();
          }
        });
      }

    });
  }

  availabilityHandler(event: MouseEvent) {
    (event.target as HTMLButtonElement).disabled = true;
    this.productsService.setAvailability(this.productId, this.isAvailable ? true : false).subscribe({
      next: (product) => {
        this.product!.deleted = product.deleted;
        (event.target as HTMLButtonElement).disabled = false;
      },
      error: err => {
        console.log(err);
        (event.target as HTMLButtonElement).disabled = false;
      }
    });
  }

  rateProduct(rating: number) {
    this.userRating$$.next(rating);
  }

  likeProduct(like: boolean) {
    this.userFavorite$$.next(like);
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