import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReview } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }

  addNewReview(text: string, productId: string) {
    return this.http.post<IReview>('/api/reviews', { text, productId });
  }

  editReview(text: string, id: string) {
    return this.http.put<IReview>(`/api/reviews/${id}`, { text });
  }

  deleteReview(id: string) {
    return this.http.delete(`/api/reviews/${id}`);
  }

  getReviews(options?: { [key: string]: string | number | boolean | { [key: string]: any } }) {

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
    return this.http.get<{ result: IReview[], count: number }>(`/api/reviews${query}`);
  }
}
