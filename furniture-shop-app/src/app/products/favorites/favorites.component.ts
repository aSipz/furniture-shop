import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, merge, map, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { loadingProduct, pageSize } from 'src/app/initial/constants';
import { IProduct } from 'src/app/initial/interfaces';
import { getQuery } from 'src/app/+store/selectors';
import { clearFavorites, loadFavorites, loadFavoritesFailure, loadFavoritesSuccess } from '../+store/actions/favoritesActions';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  products!: IProduct[];
  pages!: number;
  pageSize = pageSize;
  errorFetchingData = false;
  private sub = new Subscription();

  query$ = this.store.select(getQuery);
  query!: string;

  loadingFavorites$ = merge(
    this.actions$.pipe(
      ofType(loadFavorites),
      map(() => {
        this.products = [loadingProduct, loadingProduct, loadingProduct];
        this.pages = 1;
        this.errorFetchingData = false;
        return true;
      }),
    ),
    this.actions$.pipe(
      ofType(loadFavoritesSuccess),
      map(({ result, count }) => {
        this.products = result;
        this.pages = Math.ceil(count / this.pageSize);
        return false;
      }),
    ),
    this.actions$.pipe(
      ofType(loadFavoritesFailure),
      map(() => {
        this.products = [];
        this.pages = 0;
        this.errorFetchingData = true;
        return false;
      }),
    ),
  );

  constructor(
    private store: Store,
    private actions$: Actions,
  ) { }

  ngOnInit() {

    this.sub.add(this.loadingFavorites$.subscribe());

    this.sub.add(this.query$.pipe(
      tap(query => {
        const changedQuery = JSON.parse(JSON.stringify(query));
        if (!query['skip']) {
          changedQuery['skip'] = 0;
          changedQuery['limit'] = this.pageSize;
        }

        query['search']
          ? changedQuery['search'] = JSON.parse(changedQuery['search'])
          : changedQuery['search'] = {};

        this.store.dispatch(loadFavorites({ options: changedQuery }));
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.store.dispatch(clearFavorites());
  }

}