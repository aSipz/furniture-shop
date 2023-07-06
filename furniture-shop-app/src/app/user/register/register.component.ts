import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  serverError = '';

  @ViewChild('registerForm') registerForm!: NgForm;

  registerHandler(): void {

    if (this.registerForm.invalid) {
      return;
    }

    console.log(this.registerForm.value);

  }

  setError() {
    this.serverError = 'test error'
  }
}
