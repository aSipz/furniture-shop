import { createReducer, on } from "@ngrx/store";
import {
    addReviewSuccess,
    addToFavoritesFailure,
    addToFavoritesSuccess,
    clearProduct,
    clearReviews,
    deleteProductFailure,
    deleteProductSuccess,
    dislikeReviewSuccess,
    editReviewSuccess,
    likeReviewSuccess,
    loadProductFailure,
    loadProductSuccess,
    loadReviewsFailure,
    loadReviewsSuccess,
    rateProductFailure,
    rateProductSuccess,
    setAvailableFailure,
    setAvailableSuccess
} from "./actions";
import { IFavorite, IProduct, IRating, IReview } from "src/app/initial/interfaces";
import { loadingReview } from "src/app/initial/constants";


export interface IProductDetailsState {
    product: IProduct | null;
    favorite: IFavorite | null;
    reviews: IReview[];
    error: any;
    reviewsCount: number;
    reviewError: any;
};

const initialState: IProductDetailsState = {
    product: null,
    favorite: null,
    reviews: [loadingReview, loadingReview, loadingReview],
    error: null,
    reviewsCount: 3,
    reviewError: null,
}

export const productReducer = createReducer<IProductDetailsState>(
    initialState,
    on(loadProductSuccess, (state, { product, favorite }) => {
        return { ...state, product, favorite, error: null };
    }),
    on(loadProductFailure, (state, { error }) => {
        return { ...state, product: null, favorite: null, error }
    }),
    on(clearProduct, () => initialState),
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
    on(deleteProductSuccess, () => initialState),
    on(deleteProductFailure, (state, { error }) => {
        return { ...state, error };
    }),
    on(loadReviewsSuccess, (state, { count, reviews }) => {
        return { ...state, reviews, reviewsCount: count, reviewError: null };
    }),
    on(loadReviewsFailure, (state, { error }) => {
        return { ...state, reviewError: error };
    }),
    on(clearReviews, (state) => {
        return { ...state, reviews: initialState.reviews, reviewsCount: initialState.reviewsCount, reviewError: null };
    }),
    on(likeReviewSuccess, (state, { reviewId, userId }) => {
        return { ...state, reviews: state.reviews.map(r => r._id === reviewId ? { ...r, likes: [...r.likes, userId] } : r) };
    }),
    on(dislikeReviewSuccess, (state, { reviewId, userId }) => {
        return { ...state, reviews: state.reviews.map(r => r._id === reviewId ? { ...r, likes: r.likes.filter(l => l !== userId) } : r) };
    }),
    on(addReviewSuccess, (state, { review }) => {
        return { ...state, reviews: { ...state.reviews, review } };
    }),
    on(editReviewSuccess, (state, { review }) => {
        return { ...state, reviews: state.reviews.map(r => r._id === review._id ? review : r) };
    }),
);