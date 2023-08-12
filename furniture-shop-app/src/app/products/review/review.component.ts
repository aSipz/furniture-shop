import { Component, Input, OnDestroy, AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, filter, map, merge, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { faThumbsUp as faThumbSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { IReview } from 'src/app/initial/interfaces';
import { deleteReview, deleteReviewFailure, deleteReviewSuccess, dislikeReview, likeReview } from '../+store/actions/detailsActions';
import { getUser, isLoggedIn } from 'src/app/+store/selectors';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnDestroy, AfterContentInit {

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

  isLoggedIn$ = this.store.select(isLoggedIn);
  user$ = this.store.select(getUser);

  isOwner!: boolean;
  isLiked!: boolean;
  userId!: string | null;

  constructor(
    private store: Store,
    private actions$: Actions,
    public modal: MatDialog
  ) {
    this.sub.add(this.delete_review$.subscribe());

  }

  ngAfterContentInit(): void {
    this.sub.add(this.user$.pipe(
      tap(u => {
        this.isOwner = u?._id === this.review.ownerId._id;
        this.isLiked = !!(u?._id && this.review.likes.includes(u?._id));
        this.userId = u ? u._id : null;
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  like() {
    this.store.dispatch(likeReview({ reviewId: this.review._id, userId: this.userId! }));
  }

  dislike() {
    this.store.dispatch(dislikeReview({ reviewId: this.review._id, userId: this.userId! }));
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
