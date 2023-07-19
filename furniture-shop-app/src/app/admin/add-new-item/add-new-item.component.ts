import { Component, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { productCategories } from 'src/app/shared/constants';
import {  categoryValidator } from 'src/app/shared/validators';
import { FileUploadService } from '../services/file-upload.service';
import { ProductsService } from 'src/app/products/services/products.service';

@Component({
  selector: 'app-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.css']
})
export class AddNewItemComponent implements OnDestroy {

  serverError = '';
  categories: string[] = productCategories;
  submitSuccess = false;

  images: any[] = [];

  addNewForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', [Validators.required, categoryValidator()]],
    color: ['', [Validators.required, Validators.minLength(3)]],
    material: ['', [Validators.required, Validators.minLength(4)]],
    price: ['', [Validators.required, Validators.min(0), Validators.max(10000)]],
    discount: [0, [Validators.min(0), Validators.max(99)]],
    quantity: ['', [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private uploadService: FileUploadService,
    private loaderService: LoaderService
  ) { }

  ngOnDestroy(): void {
    if (!this.submitSuccess) { 
      this.images.forEach(i => {
        this.uploadService.deleteFileStorage(i);
      })
    }
  }

  addImages(e: any): void {
    this.images = e;
  }

  addNewHandler(): void {

    if (this.addNewForm.invalid || this.images.length === 0) {
      return;
    }

    this.loaderService.showLoader();

    this.addNewForm.disable();

    const { name, description, category, color, material, price, discount = 0, quantity } = this.addNewForm.value;

    this.images = this.images.map(i => {
      const { isLoading, ...img } = i;
      return img;
    });

    this.productsService.addNewProduct(name!, description!, category!, color!, material!, price!, discount!, quantity!, this.images).subscribe({
      next: (product) => {
        this.submitSuccess = true;
        this.router.navigate([`/products/${product._id}/details`]);
        this.loaderService.hideLoader();
      },
      error: err => {
        console.log(err);
        this.serverError = err.error?.message ? err.error?.message : 'Something went wrong!';
        this.addNewForm.enable();
        this.loaderService.hideLoader();
      }
    });

  }
}
