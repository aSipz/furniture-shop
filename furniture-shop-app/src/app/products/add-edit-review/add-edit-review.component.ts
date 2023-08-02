import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import {  ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserService } from 'src/app/user/user.service';
import { ReviewsService } from '../services/reviews.service';
import { IReview } from 'src/app/initial/interfaces';

@Component({
  selector: 'app-add-edit-review',
  templateUrl: './add-edit-review.component.html',
  styleUrls: ['./add-edit-review.component.css']
})
export class AddEditReviewComponent implements OnInit, OnDestroy {
  serverError = '';
  private sub!: Subscription;
  private revSub!: Subscription;
  productId!: string;

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

  constructor(
    private fb: FormBuilder,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];
    });

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
      this.revSub = this.reviewsService.addNewReview(text!, this.productId).subscribe({
        next: (review) => {
          review.ownerId = this.user;
          this.onReview.emit(review);
          this.cancelHandler();
        },
        error: err => {
          console.log(err);
          this.serverError = err.error?.message;
          this.reviewForm.enable();
        }
      });
    } else {
      this.revSub = this.reviewsService.editReview(text!, this.review._id).subscribe({
        next: (review) => {
          review.ownerId = this.user;
          this.onReview.emit(review);
          this.cancelHandler();
        },
        error: err => {
          console.log(err);
          this.serverError = err.error?.message;
          this.reviewForm.enable();
        }
      });
    }
  }

  cancelHandler(): void {
    this.onCancel.emit(true);
    this.revSub && this.revSub.unsubscribe();
  }
}