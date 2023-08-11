import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { merge, map } from 'rxjs';
import { LoaderService } from '../core/services/loader.service';
import { loadUser, loadUserFailure } from '../+store/actions';
import { loadReviewsSuccess } from '../products/+store/actions';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {

  isAuthenticating$ = merge(
    this.actions$.pipe(
      ofType(loadUser),
      map(() => {
        this.loaderService.showLoader();
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(loadReviewsSuccess, loadUserFailure),
      map(() => {
        this.loaderService.hideLoader();
        return false;
      })
    ),
  )

  constructor(
    private loaderService: LoaderService,
    private store: Store,
    private actions$: Actions,
  ) {

    this.store.dispatch(loadUser());
    this.isAuthenticating$.subscribe();
  }


}
