import { createAction, props } from "@ngrx/store";
import { FileUpload } from "src/app/initial/constants";
import { IFavorite, IProduct, IRating, IReview } from "src/app/initial/interfaces";

const actionTypes = {
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

export const loadProduct = createAction(actionTypes.loadProduct, props<{ productId: string, isLoggedIn: boolean }>());
export const loadProductSuccess = createAction(actionTypes.loadProductSuccess, props<{ product: IProduct, favorite: IFavorite | null }>());
export const loadProductFailure = createAction(actionTypes.loadProductFailure, props<{ error: any }>());
export const clearProduct = createAction(actionTypes.clearProduct);

export const deleteProduct = createAction(actionTypes.deleteProduct, props<{ productId: string, images: FileUpload[] }>());
export const deleteProductSuccess = createAction(actionTypes.deleteProductSuccess);
export const deleteProductFailure = createAction(actionTypes.deleteProductFailure, props<{ error: any }>());

export const addToFavorites = createAction(actionTypes.addToFavorites, props<{ productId: string, favorite: boolean }>());
export const addToFavoritesSuccess = createAction(actionTypes.addToFavoritesSuccess, props<{ favorite: IFavorite | null }>());
export const addToFavoritesFailure = createAction(actionTypes.addToFavoritesFailure, props<{ error: any }>());

export const rateProduct = createAction(actionTypes.rateProduct, props<{ productId: string, rating: number }>());
export const rateProductSuccess = createAction(actionTypes.rateProductSuccess, props<{ rating: IRating }>())
export const rateProductFailure = createAction(actionTypes.rateProductFailure, props<{ error: any }>());

export const setAvailable = createAction(actionTypes.setAvailable, props<{ productId: string, deleted: boolean, event: MouseEvent }>());
export const setAvailableSuccess = createAction(actionTypes.setAvailableSuccess, props<{ product: IProduct }>());
export const setAvailableFailure = createAction(actionTypes.setAvailableFailure, props<{ error: any }>());

export const loadReviews = createAction(actionTypes.loadReviews, props<{ productId: string }>());
export const loadReviewsSuccess = createAction(actionTypes.loadReviewsSuccess, props<{ reviews: IReview[] }>());
export const loadReviewsFailure = createAction(actionTypes.loadReviewsFailure, props<{ error: any }>());
export const clearReviews = createAction(actionTypes.clearReviews);

export const likeReview = createAction(actionTypes.likeReview, props<{ reviewId: string, userId: string }>());
export const likeReviewSuccess = createAction(actionTypes.likeReviewSuccess, props<{ reviewId: string, userId: string }>());
export const dislikeReview = createAction(actionTypes.dislikeReview, props<{ reviewId: string, userId: string }>());
export const dislikeReviewSuccess = createAction(actionTypes.dislikeReviewSuccess, props<{ reviewId: string, userId: string }>());

export const addReview = createAction(actionTypes.addReview, props<{ productId: string, text: string, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const addReviewSuccess = createAction(actionTypes.addReviewSuccess, props<{ review: IReview, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const addReviewFailure = createAction(actionTypes.addReviewFailure, props<{ error: any, reviewId: null }>());
export const editReview = createAction(actionTypes.editReview, props<{ reviewId: string, text: string, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const editReviewSuccess = createAction(actionTypes.editReviewSuccess, props<{ review: IReview, ownerId: { firstName: string; lastName: string, _id: string } }>());
export const editReviewFailure = createAction(actionTypes.editReviewFailure, props<{ error: any, reviewId: string }>());
export const deleteReview = createAction(actionTypes.deleteReview, props<{ reviewId: string }>());
export const deleteReviewSuccess = createAction(actionTypes.deleteReviewSuccess, props<{ reviewId: string }>());
export const deleteReviewFailure = createAction(actionTypes.deleteReviewFailure, props<{ error: any, reviewId: string }>());