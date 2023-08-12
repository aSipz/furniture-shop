import { createAction, props } from "@ngrx/store";
import { ICartProduct, IProduct } from "src/app/initial/interfaces";

const actionTypes = {
    updateCart: 'LOAD_CART'
};

export const updateCart = createAction(actionTypes.updateCart, props<{ cart: ICartProduct[] | null }>());