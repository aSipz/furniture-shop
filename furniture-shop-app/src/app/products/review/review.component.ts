import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';

import { faThumbsUp as faThumbSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { IReview } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/user/user.service';
import { ReviewsService } from '../services/reviews.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  thumbSolid = faThumbSolid;
  thumb = faThumbsUp;
  isDisabled = false;
  isShown = false;

  @Input() review!: IReview;
  @Output() reviewChange = new EventEmitter<IReview>();
  @Output() onReviewDelete = new EventEmitter<string>();

  get user() {
    return this.userService.user;
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get isOwner() {
    return this.user?._id === this.review.ownerId._id;
  }

  get isLiked() {
    return this.user?._id && this.review.likes.includes(this.user?._id);
  }

  constructor(
    private userService: UserService,
    private reviewsService: ReviewsService,
  ) {
  }

  like() {
    this.reviewsService.like(this.review._id).subscribe({
      next: () => {
        this.review.likes.push(this.user!._id);
        this.reviewChange.emit(this.review);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  dislike() {
    this.reviewsService.dislike(this.review._id).subscribe({
      next: () => {
        this.review.likes = this.review.likes.filter(u => u !== this.user!._id);
        this.reviewChange.emit(this.review);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  deleteReview() {
    this.isDisabled = true;
    this.reviewsService.deleteReview(this.review._id).subscribe({
      next: () => {
        this.onReviewDelete.emit(this.review._id);
        this.isDisabled = false;
      },
      error: (err) => {
        console.log(err);
        this.isDisabled = false;
      }
    })
  }

  toggle() {
    this.isShown = !this.isShown;
  }

  onReview(review: IReview) {
    this.review = review;
    this.reviewChange.emit(review);
  }
}
