import { Component } from '@angular/core';

import { ProductsService } from '../products/products.service';
import { IProduct } from '../shared/interfaces';
import { loadingProduct } from '../shared/constants';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  products: IProduct[] = [loadingProduct, loadingProduct, loadingProduct];
  errorFetchingData = false;

  constructor(private productService: ProductsService) {
    this.productService.getProducts({ limit: 3, search: { deleted: false }, sort: '-createdAt' }).subscribe({
      next: value => this.products = value.result,
      error: err => {
        this.errorFetchingData = true;
        console.log(err);
      }
    });
  }
}
