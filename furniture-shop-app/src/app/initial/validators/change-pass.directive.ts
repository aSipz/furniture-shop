import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { changePassValidator } from './change-pass-validator';


@Directive({
  selector: '[sameValue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ChangePassDirective,
      multi: true
    }
  ]
})
export class ChangePassDirective implements Validator, OnChanges {

  @Input() passwords: string[] = [];

  validator: ValidatorFn = () => null;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const valueChange = changes['passwords'];
    
    if (valueChange) {
      this.validator = changePassValidator(valueChange.currentValue[0], valueChange.currentValue[1]);
    }
  };

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator(control);
  }
}
