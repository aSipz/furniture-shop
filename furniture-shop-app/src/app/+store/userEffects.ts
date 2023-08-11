import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadUser, loadUserFailure, loadUserSuccess, login, loginFailure, loginSuccess, logout, logoutFailure, logoutSuccess } from "./actions";
import { catchError, switchMap, map, tap } from "rxjs";
import { UserService } from "../user/user.service";
import { CartService } from "../cart/services/cart.service";
import { LoaderService } from "../core/services/loader.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class UserEffects {

    loadUser = createEffect(() => this.actions$.pipe(
        ofType(loadUser),
        switchMap(() => this.userService.getProfile().pipe(
            map(user => {
                !user && this.cartService.clearCart();
                user && this.cartService.getCart();
                return loadUserSuccess({ user });
            }),
            catchError(error => [loadUserFailure({ error })])
        ))
    ));

    logoutUser = createEffect(() => this.actions$.pipe(
        ofType(logout),
        switchMap(() => {
            this.loaderService.showLoader();
            return this.userService.logout().pipe(
                tap(() => {
                    this.router.navigate(['/']);
                    this.loaderService.hideLoader();
                }),
                map(() => logoutSuccess()),
                catchError(error => {
                    console.log(error);
                    return [logoutFailure({ error })];
                })
            );
        })
    ));

    loginUser = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap(({ email, password }) => this.userService.login(email, password).pipe(
            map(user => loginSuccess({ user })),
            catchError(error => [loginFailure({ error })])
        ))
    ));

    constructor(
        private actions$: Actions,
        private userService: UserService,
        private cartService: CartService,
        private loaderService: LoaderService,
        private router: Router,
    ) { }
}
