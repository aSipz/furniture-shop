import { createAction, props } from "@ngrx/store";
import { IFavorite, IProduct } from "src/app/initial/interfaces";

const actionTypes = {
    loadProduct: 'LOAD_PRODUCT',
    loadProductSuccess: 'LOAD_PRODUCT_SUCCESS',
    loadProductFailure: 'LOAD_PRODUCT_FAILURE',
    clearProduct: 'CLEAR_PRODUCT',
    addToFavorites: 'ADD_TO_FAVORITES',
    addToFavoritesSuccess: 'ADD_TO_FAVORITES_SUCCESS',
    rateProduct: 'RATE_PRODUCT',
};

export const loadProduct = createAction(actionTypes.loadProduct, props<{ productId: string, isLoggedIn: boolean }>());
export const loadProductSuccess = createAction(actionTypes.loadProductSuccess, props<{ product: IProduct, favorite: IFavorite | null }>());
export const loadProductFailure = createAction(actionTypes.loadProductFailure, props<{ error: any }>());
export const clearProduct = createAction(actionTypes.clearProduct);

export const addToFavorites = createAction(actionTypes.addToFavorites, props<{ productId: string, favorite: boolean }>());
export const addToFavoritesSuccess = createAction(actionTypes.addToFavorites, props<{ favorite: IFavorite | null }>());



