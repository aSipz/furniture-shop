import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Component, HostBinding, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserService } from 'src/app/user/user.service';
import { ReviewsService } from '../services/reviews.service';
import { IReview } from 'src/app/shared/interfaces';
import { loadingReview } from 'src/app/shared/constants';

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
          // style({ opacity: 0, transform: 'translateY(100px)' }),
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 0, transform: 'translateY(-100px)' }))
          ])
        ])
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
        ])
      ]),
    ]),
  ]
})
export class ReviewListComponent implements OnChanges, OnInit, OnDestroy {

  @HostBinding('@pageAnimations')
  animatePage = true;
  isShown = false;
  errorFetchingData = false;
  private sub!: Subscription;

  reviewsTotal = 3;
  reviews: IReview[] = [loadingReview, loadingReview, loadingReview];

  @Input() productId!: string;

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  constructor(
    private userService: UserService,
    private reviewSService: ReviewsService,
  ) { }

  ngOnInit() {

    this.sub = this.reviewSService.getReviews({ search: { productId: this.productId }, include: 'ownerId' }).subscribe({
      next: (value) => {
        this.reviews = value.result;
        this.reviewsTotal = value.count;
      },
      error: (err) => {
        this.errorFetchingData = true;
        this.reviewsTotal = -1;
        console.log(err);
      }
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes['productId'];

    if (currentItem.currentValue !== this.productId) {
      this.productId = currentItem.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // updateCriteria(criteria: string) {
  //   criteria = criteria ? criteria.trim() : '';

  //   // this._heroes = HEROES.filter(hero => hero.name.toLowerCase().includes(criteria.toLowerCase()));
  //   const newTotal = this.reviews.length;

  //   if (this.reviewsTotal !== newTotal) {
  //     this.reviewsTotal = newTotal;
  //   } else if (!criteria) {
  //     this.reviewsTotal = -1;
  //   }
  // }

  toggle() {
    this.isShown = !this.isShown;
    // this.reviewsTotal++;
  }

  onLike(likes : string[]) {
    console.log(likes);

  }
}
