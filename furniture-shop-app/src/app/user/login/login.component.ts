import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, map, merge } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { LoaderService } from 'src/app/core/services/loader.service';
import { emailValidator } from 'src/app/initial/validators';
import { login, loginFailure, loginSuccess } from 'src/app/+store/actions/userActions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  serverError = '';

  private sub = new Subscription();

  isLoggingIn$ = merge(
    this.actions$.pipe(
      ofType(login),
      map(() => {
        this.loaderService.showLoader();
        this.loginForm.disable();
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(loginSuccess),
      map(() => {
        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
        this.loaderService.hideLoader();
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(loginFailure),
      map(({ error }) => {
        console.log(error);
        this.serverError = error.error.message;
        this.loginForm.enable();
        this.loaderService.hideLoader();
        return false;
      })
    ),
  )

  loginForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private actions$: Actions,
  ) {
    this.sub.add(this.isLoggingIn$.subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loginHandler(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.store.dispatch(login({ email: (email as string), password: (password as string) }));

  }
}
