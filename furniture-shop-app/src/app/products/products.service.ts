import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IImageEntry, IProduct } from '../shared/interfaces';

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
    return this.http.post<IProduct>('/api/products', {
      name,
      description,
      category,
      color,
      material,
      price,
      discount,
      quantity,
      images
    });
  }

  editProduct(id: string,
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
    return this.http.put<IProduct>(`/api/products/${id}`, {
      name,
      description,
      category,
      color,
      material,
      price,
      discount,
      quantity,
      images
    });
  }

  getProduct(id: string) {
    return this.http.get<IProduct>(`/api/products/${id}`);
  }

  getProducts(options?: { [key: string]: string | number }) {

    let query = '';

    if (options) {
      query = '?';
      for (const key in options) {
        query += `${key}=${options[key]}`
      }
    }
    return this.http.get<{ result: IProduct[], count: number }>(`/api/products${query}`);
  }
}
