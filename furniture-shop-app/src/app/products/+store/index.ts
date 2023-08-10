import { createReducer, on } from "@ngrx/store";
import { addToFavorites, addToFavoritesSuccess, clearProduct, loadProductFailure, loadProductSuccess } from "./actions";
import { IFavorite, IProduct, IReview } from "src/app/initial/interfaces";


export interface IProductDetailsState {
    product: IProduct | null;
    favorite: IFavorite | null;
    reviews: IReview[] | null;
    error: any;
};

const initialState: IProductDetailsState = {
    product: null,
    favorite: null,
    reviews: null,
    error: null,
}

export const productReducer = createReducer<IProductDetailsState>(
    initialState,
    on(loadProductSuccess, (state, { product, favorite }) => {
        return { ...state, product, favorite, error: null };
    }),
    on(loadProductFailure, (state, { error }) => {
        return { ...state, product: null, favorite: null, error }
    }),
    on(clearProduct, state => (initialState)),
    on(addToFavoritesSuccess, (state, { favorite }) => {
        return { ...state, favorite };
    }),
);

// export const reducers: ActionReducerMap<IAppState> = {
//     main: mainReducer,
//     router: routerReducer
// };