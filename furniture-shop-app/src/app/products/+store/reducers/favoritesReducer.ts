import { createReducer, on } from "@ngrx/store";
import { IProduct } from "src/app/initial/interfaces";
import { clearFavorites, loadFavoritesSuccess } from "../actions/favoritesActions";

export interface IFavorites {
    products: IProduct[];
    count: number;
};

const initialFavoritesState: IFavorites = {
    products: [],
    count: 0,
};

export const favoritesReducer = createReducer<IFavorites>(
    initialFavoritesState,
    on(loadFavoritesSuccess, (state, { result, count }) => {
        return { ...state, products: result, count };
    }),
    on(clearFavorites, (state) => {
        return { ...state, ...initialFavoritesState }
    }),
);