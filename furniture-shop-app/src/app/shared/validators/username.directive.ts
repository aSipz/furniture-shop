import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { usernameValidator } from './username-validator';

@Directive({
  selector: '[appUsername]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UsernameDirective,
      multi: true
    }
  ]
})
export class UsernameDirective implements Validator {

  @Input() appUsername: undefined = undefined;

  validator: ValidatorFn = () => null;

  constructor() { this.validator = usernameValidator(); }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator(control);
  }
}
