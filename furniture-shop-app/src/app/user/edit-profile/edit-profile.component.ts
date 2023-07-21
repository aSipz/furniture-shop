import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoaderService } from 'src/app/core/services/loader.service';
import { emailValidator, usernameValidator, nameValidator, sameValueGroupValidator, changePassValidator } from 'src/app/shared/validators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  serverError = '';

  private sub!: Subscription;

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

  get user() {
    return this.userService.user;
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService
  ) {

    const { email, username, firstName, lastName } = this.user!;

    this.editForm.patchValue({ email, username, firstName, lastName });

  }

  editHandler(): void {

    if (this.editForm.invalid) {
      return;
    }

    this.loaderService.showLoader();

    this.editForm.disable();

    const { username, email, firstName, lastName, passGroup: { pass: password, oldPass: oldPassword } } = this.editForm.value;
    this.sub = this.userService.updateProfile(username!, email!, firstName!, lastName!, password ? password : null, oldPassword ? oldPassword : null)
      .subscribe({
        next: () => {
          this.router.navigate(['/user/profile']);
          this.loaderService.hideLoader();
        },
        error: err => {
          console.log(err);
          this.serverError = err.error?.message;
          this.editForm.enable();
          this.loaderService.hideLoader();
        }

      });

  }

  cancelHandler(): void {
    this.router.navigate([`/user/profile`]);
    this.onCancel();
  }

  onCancel() {
    this.sub.unsubscribe();
  }
}
