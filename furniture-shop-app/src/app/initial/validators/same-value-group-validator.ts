import { FormGroup, ValidatorFn } from "@angular/forms";

export function sameValueGroupValidator(value1: string, value2: string): ValidatorFn {
    return (control) => {

        const group = control as FormGroup;
        const ctrl1 = group.get(value1);
        const ctrl2 = group.get(value2);


        return ctrl1?.value === ctrl2?.value ? null : { sameValueValidator: true };
    }

}