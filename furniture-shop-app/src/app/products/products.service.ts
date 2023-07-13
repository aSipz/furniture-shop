import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IImageEntry } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  addNewProduct(
    name: string,
    description: string,
    category: string,
    color: string,
    material: string,
    price: number | string,
    discount: number,
    quantity: number | string,
    images: IImageEntry[]
  ) {
    return this.http.post('/api/products', {});
  }
}
