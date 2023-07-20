import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Input() review!: IReview;
  @Output() likeChange = new EventEmitter<string[]>();

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
    private reviewsService: ReviewsService
  ) { }

  like() {
    this.reviewsService.like(this.review._id).subscribe({
      next: () => {
        console.log('success');
        this.likeChange.emit([...this.review.likes, this.user!._id]);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
