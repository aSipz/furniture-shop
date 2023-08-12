import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';

import { getFavorite, getProduct } from '../+store/selectors';
import { addToFavorites } from '../+store/actions/detailsActions';

@Component({
  selector: 'app-like-product',
  templateUrl: './like-product.component.html',
  styleUrls: ['./like-product.component.css']
})
export class LikeProductComponent implements OnDestroy {

  private product$ = this.store.select(getProduct);
  private favorite$ = this.store.select(getFavorite);
  private sub = new Subscription();

  private productId!: string;
  isFavorite!: boolean;

  favoriteHandler(like: boolean) {
    this.store.dispatch(addToFavorites({ productId: this.productId, favorite: like }));
  }

  constructor(private store: Store) {

    this.sub.add(this.favorite$.pipe(
      tap(f => this.isFavorite = !!f)
    ).subscribe());

    this.sub.add(this.product$.pipe(
      tap(p => this.productId = p!._id)
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
