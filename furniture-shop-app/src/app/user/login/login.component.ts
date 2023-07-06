import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  serverError = '';

  @ViewChild('loginForm') loginForm!: NgForm;

  loginHandler(): void {

    if (this.loginForm.invalid) {
      return;
    }

    console.log(this.loginForm.value);

  }
}
