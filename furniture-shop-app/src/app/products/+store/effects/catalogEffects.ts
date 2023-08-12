import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, map } from "rxjs";

import { ProductsService } from "../../services/products.service";
import { loadProducts, loadProductsFailure, loadProductsSuccess } from "../actions/productCatalogActions";

@Injectable({
    providedIn: 'root'
})
export class CatalogEffects {

    loadProducts = createEffect(() => this.actions$.pipe(
        ofType(loadProducts),
        switchMap(({ options }) => this.productsService.getProducts(options).pipe(
            map(({ result, count }) => loadProductsSuccess({ result, count })),
            catchError(error => {
                console.log(error);
                return [loadProductsFailure({ error })]
            })
        ))
    ));

    constructor(
        private actions$: Actions,
        private productsService: ProductsService,
    ) { }
}
