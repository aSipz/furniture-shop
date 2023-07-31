import { ValidatorFn } from "@angular/forms";

export function phoneValidator(): ValidatorFn {

    const pattern = /^[A-Z]+[a-z]{1,}$/;

    return (control) => {
        return (control.value === '' || (control.value.length === 10 && control.value.startsWith('08'))) ? null : { phoneValidator: true };
    }
};