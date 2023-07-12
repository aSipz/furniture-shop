import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../user.service';
import { emailValidator } from 'src/app/shared/validators';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  serverError = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute
  ) { }

  loginHandler(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loaderService.showLoader();

    this.loginForm.disable();

    this.userService.login(email!, password!).subscribe({
      next: () => {
        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
        // this.router.navigate(['/']);
        this.loaderService.hideLoader();
      },
      error: err => {
        console.log(err);
        this.serverError = err.error?.message;
        this.loginForm.enable();
        this.loaderService.hideLoader();
      }
    });

  }
}
