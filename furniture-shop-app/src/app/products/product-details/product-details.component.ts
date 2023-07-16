import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IProduct, IRating } from 'src/app/shared/interfaces';
import { ProductsService } from '../products.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, forkJoin, mergeMap, switchMap, tap } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { FileUploadService } from 'src/app/admin/services/file-upload.service';
import { FileUpload } from 'src/app/shared/constants';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  private sub!: Subscription;
  private userRating$$ = new Subject<number>();

  productId!: string;
  product: IProduct | null = null;

  get isAdmin() {
    return this.userService.isAdmin;
  }

  get isAvailable() {
    return !this.product?.deleted;
  }

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private loaderService: LoaderService,
    private imageService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loaderService.showLoader();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];

      this.productsService.getProduct(this.productId, { include: 'ratings' }).subscribe({
        next: (value) => {
          this.product = value;
          this.loaderService.hideLoader();
        },
        error: (err) => {
          console.log(err);
          this.loaderService.hideLoader();
          this.router.navigate(['/']);
        }
      });
    });

    this.userRating$$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(rating => this.productsService.rate(this.productId, rating))
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

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editHandler(): void {
    this.router.navigate([`/admin/${this.productId}/edit-item`]);
  }

  deleteHandler(): void {
    this.loaderService.showLoader();

    setTimeout(() => {
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
      })
    });
  }

  availabilityHandler(event: MouseEvent) {
    (event.target as HTMLButtonElement).disabled = true;
    this.productsService.setAvailability(this.productId, this.isAvailable ? true : false).subscribe({
      next: (product) => {
        this.product!.deleted = product.deleted;
        (event.target as HTMLButtonElement).disabled = false;
      },
      error: err => console.log(err)
    });
  }

  rateProduct(rating: number) {
    this.userRating$$.next(rating);
  }

}