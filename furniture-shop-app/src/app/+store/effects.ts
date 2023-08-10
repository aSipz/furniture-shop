import { Injectable } from "@angular/core";
import { ProductsService } from "../products/services/products.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadProduct, loadProductFailure, loadProductSuccess } from "./actions";
import { catchError, switchMap, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Effects {

    loadProduct = createEffect(() => this.actions$.pipe(
        ofType(loadProduct),
        switchMap(({ productId, options }) => this.productsService.getProduct(productId, options).pipe(
            map(product => loadProductSuccess({ product })),
            catchError(error => [loadProductFailure({ error })])
        ))
    ));

    constructor(
        private actions$: Actions,
        private productsService: ProductsService
    ) { }
}
