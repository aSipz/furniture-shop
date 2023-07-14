import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';

import { IImageEntry, IProduct } from 'src/app/shared/interfaces';
import { ProductsService } from '../products.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Subscription } from 'rxjs';

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

  constructor(
    private productsService: ProductsService,
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

}


function ngOnInit() {
  throw new Error('Function not implemented.');
}
// serverError = '';

//   loginForm = this.fb.group({
//     email: ['', [Validators.required, emailValidator()]],
//     password: ['', [Validators.required, Validators.minLength(4)]]
//   });

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private router: Router,
//     private loaderService: LoaderService,
//     private activatedRoute: ActivatedRoute
//   ) { }

//   loginHandler(): void {

//     if (this.loginForm.invalid) {
//       return;
//     }

//     const { email, password } = this.loginForm.value;

//     this.loaderService.showLoader();

//     this.loginForm.disable();

//     this.userService.login(email!, password!).subscribe({
//       next: () => {
//         const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
//         this.router.navigate([returnUrl]);
//         // this.router.navigate(['/']);
//         this.loaderService.hideLoader();
//       },
//       error: err => {
//         console.log(err);
//         this.serverError = err.error?.message;
//         this.loginForm.enable();
//         this.loaderService.hideLoader();
//       }
//     });

//   }
