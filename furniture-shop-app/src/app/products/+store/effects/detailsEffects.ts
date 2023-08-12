import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, map, forkJoin, of, mergeMap, tap } from "rxjs";

import {
    addReview,
    addReviewFailure,
    addReviewSuccess,
    addToFavorites,
    addToFavoritesFailure,
    addToFavoritesSuccess,
    deleteProduct,
    deleteProductFailure,
    deleteProductSuccess,
    deleteReview,
    deleteReviewFailure,
    deleteReviewSuccess,
    dislikeReview,
    dislikeReviewSuccess,
    editReview,
    editReviewFailure,
    editReviewSuccess,
    likeReview,
    likeReviewSuccess,
    loadProduct,
    loadProductFailure,
    loadProductSuccess,
    loadReviews,
    loadReviewsFailure,
    loadReviewsSuccess,
    rateProduct,
    rateProductFailure,
    rateProductSuccess,
    setAvailable,
    setAvailableFailure,
    setAvailableSuccess
} from "../actions/detailsActions";
import { ProductsService } from "../../services/products.service";
import { FavoritesService } from "../../services/favorites.service";
import { RatingService } from "../../services/rating.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { FileUploadService } from "src/app/admin/services/file-upload.service";
import { ReviewsService } from "../../services/reviews.service";

@Injectable({
    providedIn: 'root'
})
export class ProductDetailsEffects {

    loadProduct = createEffect(() => this.actions$.pipe(
        ofType(loadProduct),
        switchMap(({ productId, isLoggedIn }) => {
            this.loaderService.showLoader();
            return forkJoin([
                this.productsService.getProduct(productId, { include: 'ratings' }),
                isLoggedIn
                    ? this.favoritesService.getFavorite(productId)
                    : of(null)
            ]).pipe(
                map(value => {
                    this.loaderService.hideLoader();
                    return loadProductSuccess({ product: value[0], favorite: value[1] })
                }),
                catchError(error => {
                    this.loaderService.hideLoader();
                    return [loadProductFailure({ error })]
                })
            )
        })
    ));

    favorites = createEffect(() => this.actions$.pipe(
        ofType(addToFavorites),
        switchMap(({ productId, favorite }) => {
            return favorite
                ? this.favoritesService.addFavorite(productId)
                : this.favoritesService.deleteFavorite(productId)
        }))
        .pipe(
            map(value => addToFavoritesSuccess({ favorite: value })),
            catchError(error => {
                console.log(error);
                return [addToFavoritesFailure({ error })];
            })
        )
    );

    rateProduct = createEffect(() => this.actions$.pipe(
        ofType(rateProduct),
        switchMap(({ productId, rating }) => this.ratingService.rate(productId, rating)
            .pipe(
                map(rating => rateProductSuccess({ rating })),
                catchError(error => {
                    console.log(error);
                    return [rateProductFailure({ error })];
                }))
        )
    ));

    setAvailable = createEffect(() => this.actions$.pipe(
        ofType(setAvailable),
        switchMap(({ productId, deleted, event }) => {
            (event.target as HTMLButtonElement).disabled = true;
            return this.productsService.setAvailability(productId, deleted)
                .pipe(
                    map(product => {
                        (event.target as HTMLButtonElement).disabled = false;
                        return setAvailableSuccess({ product });
                    }),
                    catchError(error => {
                        console.log(error);
                        (event.target as HTMLButtonElement).disabled = false;
                        return [setAvailableFailure({ error })];
                    }))
        })
    ));

    deleteProduct = createEffect(() => this.actions$.pipe(
        ofType(deleteProduct),
        switchMap(({ productId, images }) => {
            this.loaderService.showLoader();
            return this.productsService.deleteProduct(productId)
                .pipe(
                    tap(() => {
                        this.router.navigate(['/']);
                        this.loaderService.hideLoader();
                    }),
                    mergeMap(() => forkJoin(images.map(i => this.imageService.deleteFileStorage(i)))),
                    map(() => deleteProductSuccess()),
                    catchError(error => {
                        console.log(error);
                        this.loaderService.hideLoader();
                        return [deleteProductFailure({ error })];
                    })
                )
        })
    ));

    loadReviews = createEffect(() => this.actions$.pipe(
        ofType(loadReviews),
        switchMap(({ productId }) => this.reviewsService.getReviews({ search: { productId }, include: 'ownerId' }).pipe(
            map(({ result, count }) => loadReviewsSuccess({ reviews: result })),
            catchError(error => [loadReviewsFailure({ error })])
        ))
    ));

    likeReview = createEffect(() => this.actions$.pipe(
        ofType(likeReview),
        switchMap(({ reviewId, userId }) => this.reviewsService.like(reviewId).pipe(
            map(() => likeReviewSuccess({ reviewId, userId })),
            catchError(error => {
                console.log(error);
                return [error];
            })
        ))
    ));

    dislikeReview = createEffect(() => this.actions$.pipe(
        ofType(dislikeReview),
        switchMap(({ reviewId, userId }) => this.reviewsService.dislike(reviewId).pipe(
            map(() => dislikeReviewSuccess({ reviewId, userId })),
            catchError(error => {
                console.log(error);
                return [error];
            })
        ))
    ));

    addReview = createEffect(() => this.actions$.pipe(
        ofType(addReview),
        switchMap(({ productId, text, ownerId }) => this.reviewsService.addNewReview(text, productId).pipe(
            map((review) => addReviewSuccess({ review, ownerId })),
            catchError(error => {
                console.log(error);
                return [addReviewFailure({ error, reviewId: null })];
            })
        ))
    ));

    editReview = createEffect(() => this.actions$.pipe(
        ofType(editReview),
        switchMap(({ reviewId, text, ownerId }) => this.reviewsService.editReview(text, reviewId).pipe(
            map((review) => editReviewSuccess({ review, ownerId })),
            catchError(error => {
                console.log(error);
                return [editReviewFailure({ error, reviewId })];
            })
        ))
    ));

    deleteReview = createEffect(() => this.actions$.pipe(
        ofType(deleteReview),
        switchMap(({ reviewId }) => this.reviewsService.deleteReview(reviewId).pipe(
            map(() => deleteReviewSuccess({ reviewId })),
            catchError(error => {
                console.log(error);
                return [deleteReviewFailure({ error, reviewId })];
            })
        ))
    ));

    constructor(
        private actions$: Actions,
        private productsService: ProductsService,
        private favoritesService: FavoritesService,
        private ratingService: RatingService,
        private loaderService: LoaderService,
        private imageService: FileUploadService,
        private reviewsService: ReviewsService,
        private router: Router,
    ) { }
}