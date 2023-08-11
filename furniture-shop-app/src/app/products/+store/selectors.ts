import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IProductDetailsState } from ".";

const productSelector = createFeatureSelector<IProductDetailsState>('productDetails');

export const getProduct = createSelector(productSelector, s => s.product);
export const getFavorite = createSelector(productSelector, s => s.favorite);
export const getRatings = createSelector(productSelector, s => s.product?.ratings);
export const getReviews = createSelector(productSelector, s => s.reviews);
export const getReviewsError = createSelector(productSelector, s => s.reviewError);