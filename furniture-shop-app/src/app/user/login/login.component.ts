import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { emailValidator } from 'src/app/shared/validators';

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
    private router: Router
  ) { }

  loginHandler(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loginForm.disable();

    this.userService.login(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
        this.serverError = err.error.message;
        this.loginForm.enable();
      }
    });

  }
}
