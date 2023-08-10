import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IProductDetailsState } from ".";

const productSelector = createFeatureSelector<IProductDetailsState>('productDetails');

export const getProduct = createSelector(productSelector, s => s.product);
export const getFavorite = createSelector(productSelector, s => s.favorite);