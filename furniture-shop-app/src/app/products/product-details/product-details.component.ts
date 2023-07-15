import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IProduct } from 'src/app/shared/interfaces';
import { ProductsService } from '../products.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  rating = 3.5;

  productId!: string;
  private sub!: Subscription;

  product: IProduct | null = null;

  get isAdmin() {
    return this.userService.isAdmin;
  }

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loaderService.showLoader();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];

      this.productsService.getProduct(this.productId).subscribe({
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
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editHandler(): void {
    this.router.navigate([`/admin/${this.productId}/edit-item`]);
  }

}