import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription, merge, map } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { LoaderService } from 'src/app/core/services/loader.service';
import { emailValidator, usernameValidator, nameValidator, sameValueGroupValidator } from 'src/app/initial/validators';
import { register, registerFailure, registerSuccess } from 'src/app/+store/actions/userActions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {

  serverError = '';

  private sub = new Subscription();

  isRegistering$ = merge(
    this.actions$.pipe(
      ofType(register),
      map(() => {
        this.loaderService.showLoader();
        this.registerForm.disable();
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(registerSuccess),
      map(() => {
        this.router.navigate(['/']);
        this.loaderService.hideLoader();
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(registerFailure),
      map(({ error }) => {
        console.log(error);
        this.serverError = error.error.message;
        this.registerForm.enable();
        this.loaderService.hideLoader();
        return false;
      })
    ),
  )

  registerForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    username: ['', [Validators.required, usernameValidator()]],
    firstName: ['', [Validators.required, nameValidator()]],
    lastName: ['', [Validators.required, nameValidator()]],
    passGroup: this.fb.group({
      pass: ['', [Validators.required, Validators.minLength(4)]],
      rePass: []
    }, {
      validator: [sameValueGroupValidator('pass', 'rePass')]
    })
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private store: Store,
    private actions$: Actions,
  ) {
    this.sub.add(this.isRegistering$.subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  registerHandler(): void {

    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, firstName, lastName, passGroup: { pass: password } } = this.registerForm.value;

    this.store.dispatch(register({
      username: (username as string),
      email: (email as string),
      firstName: (firstName as string),
      lastName: (lastName as string),
      password
    }));
  }

}