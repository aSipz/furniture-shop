import { createAction, props } from "@ngrx/store";
import { FileUpload } from "src/app/initial/constants";
import { IFavorite, IProduct, IRating, IReview } from "src/app/initial/interfaces";

const detailsActionTypes = {
    loadProduct: 'LOAD_PRODUCT',
    loadProductSuccess: 'LOAD_PRODUCT_SUCCESS',
    loadProductFailure: 'LOAD_PRODUCT_FAILURE',
    deleteProduct: 'DELETE_PRODUCT',
    deleteProductSuccess: 'DELETE_PRODUCT_SUCCESS',
    deleteProductFailure: 'DELETE_PRODUCT_FAILURE',
    clearProduct: 'CLEAR_PRODUCT',
    addToFavorites: 'ADD_TO_FAVORITES',
    addToFavoritesSuccess: 'ADD_TO_FAVORITES_SUCCESS',
    addToFavoritesFailure: 'ADD_TO_FAVORITES_FAILURE',
    rateProduct: 'RATE_PRODUCT',
    rateProductSuccess: 'RATE_PRODUCT_SUCCESS',
    rateProductFailure: 'RATE_PRODUCT_FAILURE',
    setAvailable: 'SET_AVAILABLE',
    setAvailableSuccess: 'SET_AVAILABLE_SUCCESS',
    setAvailableFailure: 'SET_AVAILABLE_FAILURE',
    loadReviews: 'LOAD_REVIEWS',
    loadReviewsSuccess: 'LOAD_REVIEWS_SUCCESS',
    loadReviewsFailure: 'LOAD_REVIEWS_FAILURE',
    clearReviews: 'CLEAR_REVIEWS',
    likeReview: 'LIKE_REVIEW',
    likeReviewSuccess: 'LIKE_REVIEW_SUCCESS',
    dislikeReview: 'DISLIKE_REVIEW',
    dislikeReviewSuccess: 'DISLIKE_REVIEW_SUCCESS',
    addReview: 'ADD_REVIEW',
    addReviewSuccess: 'ADD_REVIEW_SUCCESS',
    addReviewFailure: 'ADD_REVIEW_FAILURE',
    editReview: 'EDIT_REVIEW',
    editReviewSuccess: 'EDIT_REVIEW_SUCCESS',
    editReviewFailure: 'EDIT_REVIEW_FAILURE',
    deleteReview: 'DELETE_REVIEW',
    deleteReviewSuccess: 'DELETE_REVIEW_SUCCESS',
    deleteReviewFailure: 'DELETE_REVIEW_FAILURE',
};

export const loadProduct = createAction(detailsActionTypes.loadProduct, props<{ productId: string, isLoggedIn: boolean }>());
export const loadProductSuccess = createAction(detailsActionTypes.loadProductSuccess, props<{ product: IProduct, favorite: IFavorite | null }>());
export const loadProductFailure = createAction(detailsActionTypes.loadProductFailure, props<{ error: any }>());
export const clearProduct = createAction(detailsActionTypes.clearProduct);

export const deleteProduct = createAction(detailsActionTypes.deleteProduct, props<{ productId: string, images: FileUpload[] }>());
export const deleteProductSuccess = createAction(detailsActionTypes.deleteProductSuccess);
export const deleteProductFailure = createAction(detailsActionTypes.deleteProductFailure, props<{ error: any }>());

export const addToFavorites = createAction(detailsActionTypes.addToFavorites, props<{ productId: string, favorite: boolean }>());
export const addToFavoritesSuccess = createAction(detailsActionTypes.addToFavoritesSuccess, props<{ favorite: IFavorite | null }>());
export const addToFavoritesFailure = createAction(detailsActionTypes.addToFavoritesFailure, props<{ error: any }>());

export const rateProduct = createAction(detailsActionTypes.rateProduct, props<{ productId: string, rating: number }>());
export const rateProductSuccess = createAction(detailsActionTypes.rateProductSuccess, props<{ rating: IRating }>())
export const rateProductFailure = createAction(detailsActionTypes.rateProductFailure, props<{ error: any }>());

export const setAvailable = createAction(detailsActionTypes.setAvailable, props<{ productId: string, deleted: boolean, event: MouseEvent }>());
export const setAvailableSuccess = createAction(detailsActionTypes.setAvailableSuccess, props<{ product: IProduct }>());
export const setAvailableFailure = createAction(detailsActionTypes.setAvailableFailure, props<{ error: any }>());

export const loadReviews = createAction(detailsActionTypes.loadReviews, props<{ productId: string }>());
export const loadReviewsSuccess = createAction(detailsActionTypes.loadReviewsSuccess, props<{ reviews: IReview[] }>());
export const loadReviewsFailure = createAction(detailsActionTypes.loadReviewsFailure, props<{ error: any }>());
export const clearReviews = createAction(detailsActionTypes.clearReviews);

export const likeReview = createAction(detailsActionTypes.likeReview, props<{ reviewId: string, userId: string }>());
export const likeReviewSuccess = createAction(detailsActionTypes.likeReviewSuccess, props<{ reviewId: string, userId: string }>());
export const dislikeReview = createAction(detailsActionTypes.dislikeReview, props<{ reviewId: string, userId: string }>());
export const dislikeReviewSuccess = createAction(detailsActionTypes.dislikeReviewSuccess, props<{ reviewId: string, userId: string }>());

export const addReview = createAction(detailsActionTypes.addReview, props<{ productId: string, text: string, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const addReviewSuccess = createAction(detailsActionTypes.addReviewSuccess, props<{ review: IReview, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const addReviewFailure = createAction(detailsActionTypes.addReviewFailure, props<{ error: any, reviewId: null }>());
export const editReview = createAction(detailsActionTypes.editReview, props<{ reviewId: string, text: string, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const editReviewSuccess = createAction(detailsActionTypes.editReviewSuccess, props<{ review: IReview, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const editReviewFailure = createAction(detailsActionTypes.editReviewFailure, props<{ error: any, reviewId: string }>());
export const deleteReview = createAction(detailsActionTypes.deleteReview, props<{ reviewId: string }>());
export const deleteReviewSuccess = createAction(detailsActionTypes.deleteReviewSuccess, props<{ reviewId: string }>());
export const deleteReviewFailure = createAction(detailsActionTypes.deleteReviewFailure, props<{ error: any, reviewId: string }>());