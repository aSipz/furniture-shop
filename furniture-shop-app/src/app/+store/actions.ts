import { createAction, props } from "@ngrx/store";
import { IProduct } from "../initial/interfaces";

const actionTypes = {
    increment: 'INCREMENT',
    setCounter: 'SET_COUNTER',
    loadProduct: 'LOAD_PRODUCT',
    loadProductSuccess: 'LOAD_PRODUCT_SUCCESS',
    loadProductFailure: 'LOAD_PRODUCT_FAILURE',
};

export const increment = createAction(actionTypes.increment);
export const setCounter = createAction(actionTypes.setCounter, props<{ counter: number }>());

export const loadProduct = createAction(actionTypes.loadProduct, props<{ productId: string, options?: { [key: string]: string | number | boolean | { [key: string]: any } } }>());
export const loadProductSuccess = createAction(actionTypes.loadProductSuccess, props<{ product: IProduct }>());
export const loadProductFailure = createAction(actionTypes.loadProductFailure, props<{ error: any }>());

