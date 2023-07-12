import { ValidatorFn } from "@angular/forms";
import { productCategories } from "../constants";

export function categoryValidator(): ValidatorFn {

    return (control) => {
        return (control.value === '' || productCategories.includes(control.value)) ? null : { categoryValidator: true };
    }
};