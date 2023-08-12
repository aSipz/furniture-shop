import { createAction, props } from "@ngrx/store";
import { IProduct } from "src/app/initial/interfaces";

const favoritesActionTypes = {
    loadFavorites: 'LOAD_FAVORITES',
    loadFavoritesSuccess: 'LOAD_FAVORITES_SUCCESS',
    loadFavoritesFailure: 'LOAD_FAVORITES_FAILURE',
    clearFavorites: 'CLEAR_FAVORITES',
};

export const loadFavorites = createAction(favoritesActionTypes.loadFavorites, props<{ options?: { [key: string]: string | number | boolean | { [key: string]: any } } }>());
export const loadFavoritesSuccess = createAction(favoritesActionTypes.loadFavoritesSuccess, props<{ result: IProduct[], count: number }>());
export const loadFavoritesFailure = createAction(favoritesActionTypes.loadFavoritesFailure, props<{ error: any }>());
export const clearFavorites = createAction(favoritesActionTypes.clearFavorites);