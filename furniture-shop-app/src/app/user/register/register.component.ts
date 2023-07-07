import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user.service';
import { API_ERROR } from 'src/app/shared/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  serverError = '';

  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(API_ERROR) private apiError: BehaviorSubject<Error | null>) { }

  registerHandler(): void {

    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, firstName, lastName, passGroup: { pass: password } } = this.registerForm.value;

    this.userService.register(username, email, password, firstName, lastName).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
        this.serverError = err.error.message;
      }

    });

  }

}
