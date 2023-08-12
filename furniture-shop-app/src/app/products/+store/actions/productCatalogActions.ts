import { createAction, props } from "@ngrx/store";
import { IProduct } from "src/app/initial/interfaces";

const catalogActionTypes = {
    loadProducts: 'LOAD_PRODUCTS',
    loadProductsSuccess: 'LOAD_PRODUCTS_SUCCESS',
    loadProductsFailure: 'LOAD_PRODUCTS_FAILURE',
    clearProducts: 'CLEAR_PRODUCTS',
};

export const loadProducts = createAction(catalogActionTypes.loadProducts, props<{ options?: { [key: string]: string | number | boolean | { [key: string]: any } } }>());
export const loadProductsSuccess = createAction(catalogActionTypes.loadProductsSuccess, props<{ result: IProduct[], count: number }>());
export const loadProductsFailure = createAction(catalogActionTypes.loadProductsFailure, props<{ error: any }>());
export const clearProducts = createAction(catalogActionTypes.clearProducts);