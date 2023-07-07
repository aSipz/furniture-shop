import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { nameValidator } from './name-validator';

@Directive({
  selector: '[appName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NameDirective,
      multi: true
    }
  ]
})
export class NameDirective implements Validator {

  @Input() appName: undefined = undefined;

  validator: ValidatorFn = () => null;

  constructor() { this.validator = nameValidator(); }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator(control);
  }
}
