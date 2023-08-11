import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged, switchMap, Subscription, tap } from 'rxjs';
import { IRating } from 'src/app/initial/interfaces';
import { UserService } from 'src/app/user/user.service';
import { getProduct, getRatings } from '../+store/selectors';
import { rateProduct } from '../+store/actions';


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

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  constructor(
    private userService: UserService,
    private store: Store,
  ) {
    this.sub.add(this.rate$$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(async (rating) => this.store.dispatch(rateProduct({ productId: this.productId, rating })))
    ).subscribe());

    this.sub.add(this.ratings$.pipe(
      tap(r => {
        const ratings = r as IRating[];
        this.userRating = ratings.find(r => r.ownerId === this.userService.user?._id)?.rating ?? null;
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