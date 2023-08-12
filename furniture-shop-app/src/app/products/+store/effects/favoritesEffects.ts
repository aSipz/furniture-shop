import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, map } from "rxjs";

import { FavoritesService } from "../../services/favorites.service";
import { loadFavorites, loadFavoritesFailure, loadFavoritesSuccess } from "../actions/favoritesActions";

@Injectable({
    providedIn: 'root'
})
export class FavoritesEffects {

    loadFavorites = createEffect(() => this.actions$.pipe(
        ofType(loadFavorites),
        switchMap(({ options }) => this.favoritesService.getAll(options).pipe(
            map(({ result, count }) => loadFavoritesSuccess({ result, count })),
            catchError(error => {
                console.log(error);
                return [loadFavoritesFailure({ error })]
            })
        ))
    ));

    constructor(
        private actions$: Actions,
        private favoritesService: FavoritesService
    ) { }
}
