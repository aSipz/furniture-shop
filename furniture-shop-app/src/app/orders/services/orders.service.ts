import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  newOrder(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    notes: string,
    amount: number,
    products: { count: number, productId: string }[]
  ) {
    return this.http.post('/api/orders', {
      firstName,
      lastName,
      email,
      phone,
      address,
      notes,
      products,
      amount
    });
  }

  getOrdersByUserId(userId: string) {
    const query = `?search=${JSON.stringify({ ownerId: userId })}&include=products.productId&sort=-createdAt`;
    return this.http.get<{ result: IOrder[], count: number }>(`/api/orders${query}`);
  }

  getOrders(options?: { [key: string]: string | number | boolean | { [key: string]: any } }) {

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
    return this.http.get<{ result: IOrder[], count: number }>(`/api/orders${query}`);
  }

  changeOrderStatus(orderId: string, status: string) {
    return this.http.put(`/api/orders/${orderId}`, { status });
  }
}