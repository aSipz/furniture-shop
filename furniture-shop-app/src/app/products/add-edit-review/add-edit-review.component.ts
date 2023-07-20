import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoaderService } from 'src/app/core/services/loader.service';
import { UserService } from 'src/app/user/user.service';
import { ReviewsService } from '../services/reviews.service';
import { IReview } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-add-edit-review',
  templateUrl: './add-edit-review.component.html',
  styleUrls: ['./add-edit-review.component.css']
})
export class AddEditReviewComponent implements OnInit, OnDestroy {
  serverError = '';
  private sub!: Subscription;
  productId!: string;

  reviewForm = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(10)]]
  });

  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onReview = new EventEmitter<IReview>();
  @Input() formType: string = 'Post';

  constructor(
    private fb: FormBuilder,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
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

    if (this.formType === 'Post') {
      this.reviewsService.addNewReview(text!, this.productId).subscribe({
        next: (review) => {
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
  }
}
