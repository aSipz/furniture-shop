import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRating } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  rate(productId: string, rating: number) {
    return this.http.post<IRating>(`/api/rate`, { rating, productId });
  }

  get(productId: string, ownerId: string) {
    return this.http.get<IRating>(`/api/rate/${productId}/${ownerId}`);
  }
}
