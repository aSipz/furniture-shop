import { Component, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription, merge, map, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { LoaderService } from 'src/app/core/services/loader.service';
import { emailValidator, usernameValidator, nameValidator, sameValueGroupValidator, changePassValidator } from 'src/app/initial/validators';
import { updateProfile, updateProfileFailure, updateProfileSuccess } from 'src/app/+store/actions/userActions';
import { getUser } from 'src/app/+store/selectors';
import { IUser } from 'src/app/initial/interfaces';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnDestroy {
  serverError = '';

  private sub = new Subscription();

  isUpdatingProfile$ = merge(
    this.actions$.pipe(
      ofType(updateProfile),
      map(() => {
        this.loaderService.showLoader();
        this.editForm.disable();
        return true;
      })
    ),
    this.actions$.pipe(
      ofType(updateProfileSuccess),
      map(() => {
        this.router.navigate(['/user/profile']);
        this.loaderService.hideLoader();
        return false;
      })
    ),
    this.actions$.pipe(
      ofType(updateProfileFailure),
      map(({ error }) => {
        console.log(error);
        this.serverError = error.error.message;
        this.editForm.enable();
        this.loaderService.hideLoader();
        return false;
      })
    ),
  );

  editForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    username: ['', [Validators.required, usernameValidator()]],
    firstName: ['', [Validators.required, nameValidator()]],
    lastName: ['', [Validators.required, nameValidator()]],
    passGroup: this.fb.group({
      oldPass: ['', [Validators.minLength(4)]],
      pass: ['', [Validators.minLength(4)]],
      rePass: ['']
    }, {
      validator: [sameValueGroupValidator('pass', 'rePass'), changePassValidator('oldPass', 'pass')]
    })
  });

  user$ = this.store.select(getUser);
  user!: IUser | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private store: Store,
    private actions$: Actions,
  ) {

    this.sub.add(this.isUpdatingProfile$.subscribe());
    this.sub.add(this.user$.pipe(
      tap(user => this.user = user)
    ).subscribe());

    const { email, username, firstName, lastName } = this.user!;
    this.editForm.patchValue({ email, username, firstName, lastName });

  }

  ngOnDestroy(): void {
    this.onCancel();
  }

  editHandler(): void {

    if (this.editForm.invalid) {
      return;
    }

    const { username, email, firstName, lastName, passGroup: { pass: password, oldPass: oldPassword } } = this.editForm.value;

    this.store.dispatch(updateProfile({
      username: (username as string),
      email: (email as string),
      firstName: (firstName as string),
      lastName: (lastName as string),
      password,
      oldPassword
    }));
  }

  cancelHandler(): void {
    this.router.navigate([`/user/profile`]);
    this.onCancel();
  }

  onCancel() {
    this.sub.unsubscribe();
  }
}
