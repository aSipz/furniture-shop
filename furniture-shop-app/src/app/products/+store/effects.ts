import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addToFavorites, addToFavoritesSuccess, loadProduct, loadProductFailure, loadProductSuccess } from "./actions";
import { catchError, switchMap, map, forkJoin, of } from "rxjs";
import { ProductsService } from "../services/products.service";
import { FavoritesService } from "../services/favorites.service";

@Injectable({
    providedIn: 'root'
})
export class ProductEffects {

    // loadProduct = createEffect(() => this.actions$.pipe(
    //     ofType(loadProduct),
    //     switchMap(({ productId, options }) => this.productsService.getProduct(productId, options).pipe(
    //         map(product => loadProductSuccess({ product })),
    //         catchError(error => [loadProductFailure({ error })])
    //     ))
    // ));

    loadProduct = createEffect(() => this.actions$.pipe(
        ofType(loadProduct),
        switchMap(({ productId, isLoggedIn }) => forkJoin([
            this.productsService.getProduct(productId, { include: 'ratings' }),
            isLoggedIn
                ? this.favoritesService.getFavorite(productId)
                : of(null)
        ]).pipe(
            map(value => loadProductSuccess({ product: value[0], favorite: value[1] })),
            catchError(error => [loadProductFailure({ error })])
        ))
    ));

    favorites = createEffect(() => this.actions$.pipe(
        ofType(addToFavorites),
        switchMap(({ productId, favorite }) => favorite
            ? this.favoritesService.addFavorite(productId)
            : this.favoritesService.deleteFavorite(productId)
        )).pipe(
            map(value => {
                console.log(value);
                
                return addToFavoritesSuccess({ favorite: value })}),
            catchError(error => [loadProductFailure({ error })])
        ));

    constructor(
        private actions$: Actions,
        private productsService: ProductsService,
        private favoritesService: FavoritesService,
    ) { }
}
