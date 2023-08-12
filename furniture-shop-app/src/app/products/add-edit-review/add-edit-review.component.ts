import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { Subscription, tap, merge, map, filter } from 'rxjs';

import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { IReview, IUser } from 'src/app/initial/interfaces';
import { getProduct } from '../+store/selectors';
import { addReview, addReviewFailure, addReviewSuccess, editReview, editReviewFailure, editReviewSuccess } from '../+store/actions/detailsActions';
import { getUser } from 'src/app/+store/selectors';

@Component({
  selector: 'app-add-edit-review',
  templateUrl: './add-edit-review.component.html',
  styleUrls: ['./add-edit-review.component.css']
})
export class AddEditReviewComponent implements OnInit, OnDestroy {
  serverError = '';
  private sub = new Subscription();
  productId!: string;

  private product$ = this.store.select(getProduct);

  reviewForm = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(10)]]
  });

  @Output() onCancel = new EventEmitter<boolean>();
  @Input() review: IReview | null = null;

  user$ = this.store.select(getUser);
  user!: { firstName: string; lastName: string; _id: string };

  add_edit_review$ = merge(
    this.actions$.pipe(
      ofType(addReview),
      map(() => {
        this.reviewForm.disable();
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(editReview),
      filter(({ reviewId }) => reviewId === this.review?._id),
      map(() => {
        this.reviewForm.disable();
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(editReviewSuccess),
      filter(({ review }) => review._id === this.review?._id),
      map(() => {
        this.cancelHandler();
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(addReviewSuccess),
      filter(() => !this.review),
      map(() => {
        this.cancelHandler();
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(addReviewFailure),
      filter(({ reviewId }) => reviewId === null),
      map(({ error }) => {
        this.reviewForm.enable();
        this.serverError = error.error.message;
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(editReviewFailure),
      filter(({ reviewId }) => reviewId === this.review?._id),
      map(({ error }) => {
        this.reviewForm.enable();
        this.serverError = error.error.message;
        return false;
      })
    ),
  )

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
  ) { }

  ngOnInit() {
    this.sub.add(this.product$.pipe(
      tap(p => this.productId = p!._id)
    ).subscribe());

    this.sub.add(this.add_edit_review$.subscribe());

    this.sub.add(this.user$.pipe(
      tap(u => {
        const { firstName, lastName, _id } = u as IUser;
        this.user = { firstName, lastName, _id }
      })
    ).subscribe())

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
      this.store.dispatch(addReview({ productId: this.productId, text: (text as string), ownerId: this.user }));
    } else {
      this.store.dispatch(editReview({ reviewId: this.review._id, text: (text as string), ownerId: this.user }));
    }
  }

  cancelHandler(): void {
    this.onCancel.emit(true);
  }
}