import { createReducer, on } from "@ngrx/store";
import { IProduct } from "src/app/initial/interfaces";
import { clearProducts, loadProductsSuccess } from "../actions/productCatalogActions";

export interface IProductCatalog {
    products: IProduct[];
    count: number;
}

const initialCatalogState: IProductCatalog = {
    products: [],
    count: 0,
}

export const productCatalogReducer = createReducer<IProductCatalog>(
    initialCatalogState,
    on(loadProductsSuccess, (state, { result, count }) => {
        return { ...state, products: result, count };
    }),
    on(clearProducts, (state) => {
        return { ...state, ...initialCatalogState }
    })
);