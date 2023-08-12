import { Component } from '@angular/core';

import { Subscription, tap, merge, map } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { IProduct } from 'src/app/initial/interfaces';
import { loadingProduct, pageSize } from 'src/app/initial/constants';
import { getQuery, isAdmin } from 'src/app/+store/selectors';
import { clearProducts, loadProducts, loadProductsFailure, loadProductsSuccess } from '../+store/actions/productCatalogActions';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  products!: IProduct[];
  pages!: number;
  pageSize = pageSize;
  errorFetchingData = false;
  private sub = new Subscription();

  query$ = this.store.select(getQuery);
  isAdmin$ = this.store.select(isAdmin);
  isAdmin!: boolean;
  query!: string;

  loadingProducts$ = merge(
    this.actions$.pipe(
      ofType(loadProducts),
      map(() => {
        this.products = [loadingProduct, loadingProduct, loadingProduct];
        this.pages = 1;
        this.errorFetchingData = false;
        return true;
      }),
    ),
    this.actions$.pipe(
      ofType(loadProductsSuccess),
      map(({ result, count }) => {
        this.products = result;
        this.pages = Math.ceil(count / this.pageSize);
        return false;
      }),
    ),
    this.actions$.pipe(
      ofType(loadProductsFailure),
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

    this.sub.add(this.isAdmin$.pipe(
      tap(a => this.isAdmin = a)
    ).subscribe());

    this.sub.add(this.loadingProducts$.subscribe());

    this.sub.add(this.query$.pipe(
      tap(query => {
        const changedQuery = JSON.parse(JSON.stringify(query));

        if (!query['skip']) {
          changedQuery['skip'] = 0;
          changedQuery['limit'] = this.pageSize;
        }

        if (!this.isAdmin) {
          if (!query['search']) {
            changedQuery['search'] = { deleted: false };
          } else {
            const search = JSON.parse(changedQuery['search']);
            search.deleted = false;
            changedQuery['search'] = search;
          }
        } else {
          query['search']
            ? changedQuery['search'] = JSON.parse(changedQuery['search'])
            : changedQuery['search'] = {};
        }

        this.store.dispatch(loadProducts({ options: changedQuery }));
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.store.dispatch(clearProducts());
  }
}