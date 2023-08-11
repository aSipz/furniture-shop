import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subscription, tap, merge, map } from 'rxjs';

import { UserService } from 'src/app/user/user.service';
import { ReviewsService } from '../services/reviews.service';
import { IReview } from 'src/app/initial/interfaces';
import { Store } from '@ngrx/store';
import { getProduct } from '../+store/selectors';
import { Actions, ofType } from '@ngrx/effects';
import { addReview, addReviewFailure, addReviewSuccess, editReview, editReviewFailure, editReviewSuccess } from '../+store/actions';

@Component({
  selector: 'app-add-edit-review',
  templateUrl: './add-edit-review.component.html',
  styleUrls: ['./add-edit-review.component.css']
})
export class AddEditReviewComponent implements OnInit, OnDestroy {
  serverError = '';
  private sub = new Subscription();
  // private sub!: Subscription;
  private revSub!: Subscription;
  productId!: string;

  private product$ = this.store.select(getProduct);

  reviewForm = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(10)]]
  });

  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onReview = new EventEmitter<IReview>();
  @Input() review: IReview | null = null;

  get user() {
    const { firstName, lastName, _id } = this.userService.user!;

    return { firstName, lastName, _id };
  }

  add_edit_review$ = merge(
    this.actions$.pipe(
      ofType(addReview || editReview),
      map(() => {
        this.reviewForm.disable();
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(addReviewSuccess || editReviewSuccess),
      map(() => {
        this.cancelHandler();
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(editReviewFailure),
      map(({error}) => {
        console.log(error.error);

        this.reviewForm.enable();
        this.serverError = error.error.message;
        return false;
      })
    )
  )

  constructor(
    private fb: FormBuilder,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private userService: UserService,
    private store: Store,
    private actions$: Actions,
  ) { }

  ngOnInit() {
    // this.sub = this.route.params.subscribe(params => {
    //   this.productId = params['id'];
    // });

    this.sub.add(this.product$.pipe(
      tap(p => this.productId = p!._id)
    ).subscribe());

    this.sub.add(this.add_edit_review$.subscribe());

    if (this.review) {
      const text = this.review.text as string;
      this.reviewForm.setValue({ text });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submitHandler(): void {

    if (this.reviewForm.invalid) {
      return;
    }

    const { text } = this.reviewForm.value;

    this.reviewForm.disable();

    if (!this.review) {
      this.store.dispatch(addReview({ productId: this.productId, text: (text as string) }));
      // this.revSub = this.reviewsService.addNewReview(text!, this.productId).subscribe({
      //   next: (review) => {
      //     review.ownerId = this.user;
      //     this.onReview.emit(review);
      //     this.cancelHandler();
      //   },
      //   error: err => {
      //     console.log(err);
      //     this.serverError = err.error?.message;
      //     this.reviewForm.enable();
      //   }
      // });
    } else {
      this.store.dispatch(editReview({ productId: this.productId, text: (text as string) }));
      // this.revSub = this.reviewsService.editReview(text!, this.review._id).subscribe({
      //   next: (review) => {
      //     review.ownerId = this.user;
      //     this.onReview.emit(review);
      //     this.cancelHandler();
      //   },
      //   error: err => {
      //     console.log(err);
      //     this.serverError = err.error?.message;
      //     this.reviewForm.enable();
      //   }
      // });
    }
  }

  cancelHandler(): void {
    this.onCancel.emit(true);
    this.revSub && this.revSub.unsubscribe();
  }
}