import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged, switchMap, Subscription, tap } from 'rxjs';
import { IRating } from 'src/app/initial/interfaces';
import { getProduct, getRatings } from '../+store/selectors';
import { rateProduct } from '../+store/actions/detailsActions';
import { getUser, isLoggedIn } from 'src/app/+store/selectors';


@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnDestroy {

  userRating: number | null = null;
  private rate$$ = new Subject<number>();
  private productId!: string;
  private sub = new Subscription();

  ratings$ = this.store.select(getRatings);
  private product$ = this.store.select(getProduct);

  isLoggedIn$ = this.store.select(isLoggedIn);
  private user$ = this.store.select(getUser);
  private userId!: string | null;

  constructor(
    private store: Store,
  ) {
    this.sub.add(this.rate$$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(async (rating) => this.store.dispatch(rateProduct({ productId: this.productId, rating })))
    ).subscribe());

    this.sub.add(this.user$.pipe(
      tap(u => this.userId = u ? u._id : null)
    ).subscribe());

    this.sub.add(this.ratings$.pipe(
      tap(r => {
        const ratings = r as IRating[];
        this.userRating = ratings.find(r => r.ownerId === this.userId)?.rating ?? null;
      })
    ).subscribe())

    this.sub.add(this.product$.pipe(
      tap(p => this.productId = p!._id)
    ).subscribe());

    
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  rateHandler(rating: number) {
    this.rate$$.next(rating);
  }

}