import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IProductState } from ".";

const productSelector = createFeatureSelector<IProductState>('products');

export const getProduct = createSelector(productSelector, s => s.productDetails.product);
export const getFavorite = createSelector(productSelector, s => s.productDetails.favorite);
export const getRatings = createSelector(productSelector, s => s.productDetails.product?.ratings);
export const getReviews = createSelector(productSelector, s => s.productDetails.reviews);
export const getReviewsError = createSelector(productSelector, s => s.productDetails.reviewError);

export const getCatalog = createSelector(productSelector, s=> s.productCatalog);