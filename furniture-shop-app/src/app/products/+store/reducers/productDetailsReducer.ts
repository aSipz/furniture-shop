import { createReducer, on } from "@ngrx/store";
import { loadingReview } from "src/app/initial/constants";
import { IProduct, IFavorite, IReview, IRating } from "src/app/initial/interfaces";
import {
    loadProductSuccess,
    loadProductFailure,
    clearProduct,
    addToFavoritesSuccess,
    addToFavoritesFailure,
    rateProductSuccess,
    rateProductFailure,
    setAvailableSuccess,
    setAvailableFailure,
    deleteProductSuccess,
    deleteProductFailure,
    loadReviewsSuccess,
    loadReviewsFailure,
    clearReviews,
    likeReviewSuccess,
    dislikeReviewSuccess,
    addReviewSuccess,
    editReviewSuccess,
    deleteReviewSuccess
} from "../actions/detailsActions";

export interface IProductDetailsState {
    product: IProduct | null;
    favorite: IFavorite | null;
    reviews: IReview[];
    error: any;
    reviewError: any;
};

const initialDetailsState: IProductDetailsState = {
    product: null,
    favorite: null,
    reviews: [loadingReview, loadingReview, loadingReview],
    error: null,
    reviewError: null,
}

export const productDetailsReducer = createReducer<IProductDetailsState>(
    initialDetailsState,
    on(loadProductSuccess, (state, { product, favorite }) => {
        return { ...state, product, favorite, error: null };
    }),
    on(loadProductFailure, (state, { error }) => {
        return { ...state, product: null, favorite: null, error }
    }),
    on(clearProduct, () => initialDetailsState),
    on(addToFavoritesSuccess, (state, { favorite }) => {
        return { ...state, favorite, error: null };
    }),
    on(addToFavoritesFailure, (state, { error }) => {
        return { ...state, error };
    }),
    on(rateProductSuccess, (state, { rating }) => {
        const newRatings: IRating[] = [];
        const existingRating = (state.product?.ratings as IRating[]).find(r => r._id === rating._id);
        existingRating
            ? newRatings.push(...(state.product?.ratings as IRating[]).map(r => r._id === existingRating._id ? { ...r, rating: rating.rating } : r))
            : newRatings.push(...(state.product?.ratings as IRating[]), rating);
        return { ...state, product: { ...state.product!, ratings: newRatings }, error: null };
    }),
    on(rateProductFailure, (state, { error }) => {
        return { ...state, error };
    }),
    on(setAvailableSuccess, (state, { product }) => {
        return { ...state, product: { ...state.product!, deleted: product.deleted }, error: null };
    }),
    on(setAvailableFailure, (state, { error }) => {
        return { ...state, error };
    }),
    on(deleteProductSuccess, () => initialDetailsState),
    on(deleteProductFailure, (state, { error }) => {
        return { ...state, error };
    }),
    on(loadReviewsSuccess, (state, { reviews }) => {
        return { ...state, reviews, reviewError: null };
    }),
    on(loadReviewsFailure, (state, { error }) => {
        return { ...state, reviewError: error };
    }),
    on(clearReviews, (state) => {
        return { ...state, reviews: initialDetailsState.reviews, reviewError: null };
    }),
    on(likeReviewSuccess, (state, { reviewId, userId }) => {
        return { ...state, reviews: state.reviews.map(r => r._id === reviewId ? { ...r, likes: [...r.likes, userId] } : r) };
    }),
    on(dislikeReviewSuccess, (state, { reviewId, userId }) => {
        return { ...state, reviews: state.reviews.map(r => r._id === reviewId ? { ...r, likes: r.likes.filter(l => l !== userId) } : r) };
    }),
    on(addReviewSuccess, (state, { review, ownerId }) => {
        return { ...state, reviews: [...state.reviews, { ...review, ownerId }] };
    }),
    on(editReviewSuccess, (state, { review, ownerId }) => {
        return { ...state, reviews: state.reviews.map(r => r._id === review._id ? { ...review, ownerId } : r) };
    }),
    on(deleteReviewSuccess, (state, { reviewId }) => {
        return { ...state, reviews: state.reviews.filter(r => r._id !== reviewId) };
    }),
);