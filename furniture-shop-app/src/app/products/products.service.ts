import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IImageEntry, IProduct, IRating } from '../shared/interfaces';

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

  getProduct(id: string, options?: { [key: string]: string | number | boolean | { [key: string]: any } }) {
    let query = '';

    if (options) {
      query = '?';
      const queryArr = [];
      for (const key in options) {

        const value = key === 'search' ? JSON.stringify(options[key]) : options[key];

        queryArr.push(`${key}=${value}`);

      }
      query += queryArr.join('&');
    }
    return this.http.get<IProduct>(`/api/products/${id}${query}`);
  }

  deleteProduct(id: string) {
    return this.http.delete(`/api/products/${id}`);
  }

  setAvailability(id: string, deleted: boolean) {
    return this.http.put<IProduct>(`/api/products/${id}`, { deleted });
  }

  rate(id: string, rating: number) {
    return this.http.post<IRating>(`/api/products/${id}/rate`, { rating });
  }

  getProducts(options?: { [key: string]: string | number | boolean | { [key: string]: any } }) {

    let query = '';

    if (options) {
      query = '?';
      const queryArr = [];
      for (const key in options) {

        const value = key === 'search' ? JSON.stringify(options[key]) : options[key];

        queryArr.push(`${key}=${value}`);

      }
      query += queryArr.join('&');
    }
    return this.http.get<{ result: IProduct[], count: number }>(`/api/products${query}`);
  }
}
