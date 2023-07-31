import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { sameValueGroupValidator } from './same-value-group-validator';


@Directive({
  selector: '[sameValue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SameValueDirective,
      multi: true
    }
  ]
})
export class SameValueDirective implements Validator, OnChanges {

  @Input() sameValue: string[] = [];

  validator: ValidatorFn = () => null;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const valueChange = changes['sameValue'];
    
    if (valueChange) {
      this.validator = sameValueGroupValidator(valueChange.currentValue[0], valueChange.currentValue[1]);
    }
  };

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator(control);
  }
}
