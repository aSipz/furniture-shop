import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { emailValidator, nameValidator, sameValueGroupValidator, usernameValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  serverError = '';

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
    private userService: UserService,
    private router: Router
  ) { }

  registerHandler(): void {

    if (this.registerForm.invalid) {
      return;
    }

    this.registerForm.disable();

    const { username, email, firstName, lastName, passGroup: { pass: password } } = this.registerForm.value;

    this.userService.register(username!, email!, password, firstName!, lastName!).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
        this.serverError = err.error?.message;
        this.registerForm.enable();
      }

    });

  }

}
