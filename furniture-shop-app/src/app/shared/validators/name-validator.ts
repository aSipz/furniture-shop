import { ValidatorFn } from "@angular/forms";

export function nameValidator(): ValidatorFn {

    const pattern = /^[A-Z]+[a-z]{1,}$/;

    return (control) => {
        return (control.value === '' || pattern.test(control.value)) ? null : { nameValidator: true };
    }
};