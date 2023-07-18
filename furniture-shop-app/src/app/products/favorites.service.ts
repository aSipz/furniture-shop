import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFavorite, IProduct } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http: HttpClient) { }

  getFavorite(id: string) {
    return this.http.get<IFavorite | null>(`/api/favorites/${id}`);
  }

  addFavorite(productId: string) {
    return this.http.post<IFavorite>(`/api/favorites`, { productId });
  }

  deleteFavorite(id: string) {
    return this.http.delete(`/api/favorites/${id}`);
  }

  getAll(options?: { [key: string]: string | number | boolean | { [key: string]: any } }) {

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
    return this.http.get<{ result: IProduct[], count: number }>(`/api/favorites${query}`);
  }
}
