import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { merge, map, tap } from 'rxjs';
import { LoaderService } from '../core/services/loader.service';
import { loadUser, loadUserFailure, loadUserSuccess } from '../+store/actions/userActions';
import { CartService } from '../cart/services/cart.service';
import { updateCart } from '../+store/actions/cartActions';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {

  isAuthenticating$ = merge(
    this.actions$.pipe(
      ofType(loadUser),
      tap(() => this.loaderService.showLoader()),
      map(() => true)
    ),
    this.actions$.pipe(
      ofType(loadUserSuccess),
      tap(() => {
        const cart = this.cartService.getCart();
        this.store.dispatch(updateCart({ cart }));
        this.loaderService.hideLoader();
      }),
      map(() => false)
    ),
    this.actions$.pipe(
      ofType(loadUserFailure),
      tap(() => this.loaderService.showLoader()),
      map(() => false)
    ),
  )

  constructor(
    private loaderService: LoaderService,
    private store: Store,
    private actions$: Actions,
    private cartService: CartService
  ) {
    this.isAuthenticating$.subscribe();
    this.store.dispatch(loadUser());
  }


}
