import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { emailValidator } from './email-validator';

@Directive({
  selector: '[appEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailDirective,
      multi: true
    }
  ]
})
export class EmailDirective implements Validator {

  @Input() appEmail: undefined = undefined;

  validator: ValidatorFn = () => null;

  constructor() { this.validator = emailValidator(); }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator(control);
  }
}