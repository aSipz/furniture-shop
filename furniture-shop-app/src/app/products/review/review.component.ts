import { Component, Input, OnDestroy } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { faThumbsUp as faThumbSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { UserService } from 'src/app/user/user.service';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { IReview } from 'src/app/initial/interfaces';
import { Store } from '@ngrx/store';
import { deleteReview, deleteReviewFailure, deleteReviewSuccess, dislikeReview, likeReview } from '../+store/actions';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription, filter, map, merge } from 'rxjs';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnDestroy {

  thumbSolid = faThumbSolid;
  thumb = faThumbsUp;
  isDisabled = false;
  isShown = false;
  waitingForDelete = false;

  @Input() review!: IReview;

  private sub = new Subscription();

  delete_review$ = merge(
    this.actions$.pipe(
      ofType(deleteReview),
      filter(({ reviewId }) => reviewId === this.review._id),
      map(() => {
        this.isDisabled = true;
        this.waitingForDelete = true;
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(deleteReviewSuccess),
      filter(({ reviewId }) => reviewId === this.review._id),
      map(() => {
        this.isDisabled = false;
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(deleteReviewFailure),
      filter(({ reviewId }) => reviewId === this.review._id),
      map(() => {
        this.isDisabled = false;
        this.waitingForDelete = false;
        return false;
      })
    )
  )

  get user() {
    return this.userService.user;
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get isOwner() {
    if (this.review.ownerId) {
      return this.user?._id === this.review.ownerId._id;
    }
    return false;
  }

  get isLiked() {
    return this.user?._id && this.review.likes.includes(this.user?._id);
  }

  constructor(
    private userService: UserService,
    private store: Store,
    private actions$: Actions,
    public modal: MatDialog
  ) {
    this.sub.add(this.delete_review$.subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  like() {
    this.store.dispatch(likeReview({ reviewId: this.review._id, userId: this.user!._id }));
  }

  dislike() {
    this.store.dispatch(dislikeReview({ reviewId: this.review._id, userId: this.user!._id }));
  }

  toggle() {
    this.isShown = !this.isShown;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Delete review',
      text: 'Are you sure that you want to delete your review?'
    };

    const dialogRef = this.modal.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(deleteReview({ reviewId: this.review._id }))
      }
    });
  }
}
