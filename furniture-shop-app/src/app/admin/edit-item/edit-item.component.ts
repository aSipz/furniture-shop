import { Component, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { productCategories } from 'src/app/shared/constants';
import { categoryValidator } from 'src/app/shared/validators';
import { FileUploadService } from '../services/file-upload.service';
import { ProductsService } from 'src/app/products/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnDestroy {

  serverError = '';
  categories: string[] = productCategories;
  submitSuccess = false;
  productId!: string;
  private sub!: Subscription;
  product: IProduct | null = null;

  images: any[] = [];

  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', [Validators.required, categoryValidator()]],
    color: ['', [Validators.required, Validators.minLength(3)]],
    material: ['', [Validators.required, Validators.minLength(4)]],
    price: [0, [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private uploadService: FileUploadService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
  ) {
    this.loaderService.showLoader();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];

      this.productsService.getProduct(this.productId).subscribe({
        next: (value) => {
          this.product = value;
          const { name, description, category, color, material, price, discount, quantity } = value;
          this.editForm.setValue({ name, description, category, color, material, price, discount, quantity });
          this.images = value.images as any;
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (!this.submitSuccess) {
      this.images.forEach(i => {
        if (!this.product?.images?.some(e => e.name === i.name)) {
          this.uploadService.deleteFileStorage(i);
        }
      })
    }
  }

  addImages(e: any): void {
    this.images = e;
  }

  editHandler(): void {

    if (this.editForm.invalid || this.images.length === 0) {
      return;
    }

    this.loaderService.showLoader();

    this.editForm.disable();

    const { name, description, category, color, material, price, discount = 0, quantity } = this.editForm.value;

    this.images = this.images.map(i => {
      const { isLoading, ...img } = i;
      return img;
    });

    this.productsService.editProduct(this.productId, name!, description!, category!, color!, material!, price!, discount!, quantity!, this.images!).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.router.navigate([`/products/${this.productId}/details`]);
        this.loaderService.hideLoader();
      },
      error: err => {
        console.log(err);
        this.serverError = err.error?.message ? err.error?.message : 'Something went wrong!';
        this.editForm.enable();
        this.loaderService.hideLoader();
      }
    });

  }
}
