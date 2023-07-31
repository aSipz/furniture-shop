import { ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn {

    const pattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;

    return (control) => {
        return (control.value === '' || pattern.test(control.value)) ? null : { emailValidator: true };
    }
};