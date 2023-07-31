import { ValidatorFn } from "@angular/forms";

export function usernameValidator(): ValidatorFn {

    const pattern = /^[A-Za-z0-9]{4,}$/;

    return (control) => {
        return (control.value === '' || pattern.test(control.value)) ? null : { usernameValidator: true };
    }
};