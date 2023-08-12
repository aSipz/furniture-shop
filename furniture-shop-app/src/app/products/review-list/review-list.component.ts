import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Component, HostBinding, OnDestroy } from '@angular/core';

import { Subscription, tap } from 'rxjs';

import { IReview } from 'src/app/initial/interfaces';
import { loadingReview } from 'src/app/initial/constants';
import { Store } from '@ngrx/store';
import { getProduct, getReviews, getReviewsError } from '../+store/selectors';
import { clearReviews, loadReviews } from '../+store/actions/detailsActions';
import { isLoggedIn } from 'src/app/+store/selectors';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.review', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('.review', [
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 0, transform: 'translateY(-100px)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: 0 }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, width: 0 })),
          ]),
        ], { optional: true })
      ]),
    ]),
  ]
})



export class ReviewListComponent implements OnDestroy {

  @HostBinding('@pageAnimations')
  // animatePage = true;
  isShown = false;
  errorFetchingData = false;
  private sub = new Subscription();

  reviews: IReview[] = [loadingReview, loadingReview, loadingReview];

  reviews$ = this.store.select(getReviews);
  product$ = this.store.select(getProduct);
  error$ = this.store.select(getReviewsError);

  private productId!: string;

  isLoggedIn$ = this.store.select(isLoggedIn);

  constructor(
    private store: Store,
  ) {

    this.sub.add(this.product$.pipe(
      tap(p => this.productId = p!._id)
    ).subscribe());

    this.sub.add(this.error$.pipe(
      tap(e => this.errorFetchingData = !!e)
    ).subscribe());

    this.store.dispatch(loadReviews({ productId: this.productId }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.store.dispatch(clearReviews());
  }

  toggle() {
    this.isShown = !this.isShown;
  }
}
