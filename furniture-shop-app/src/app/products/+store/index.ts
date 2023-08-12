import { ActionReducerMap } from "@ngrx/store";
import { IProductDetailsState, productDetailsReducer } from "./reducers/productDetailsReducer";
import { IFavorites, favoritesReducer } from "./reducers/favoritesReducer";
import { IProductCatalog, productCatalogReducer } from "./reducers/productCatalogReducer";


export interface IProductState {
    productDetails: IProductDetailsState;
    productCatalog: IProductCatalog;
    favorites: IFavorites;
}

export const productReducers: ActionReducerMap<IProductState> = {
    productDetails: productDetailsReducer,
    productCatalog: productCatalogReducer,
    favorites: favoritesReducer
};