import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { CartService } from "src/app/cart/services/cart.service";

export const checkoutActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

    const router = inject(Router);
    const cartService = inject(CartService);

    return cartService.cart$.pipe(
        take(1),
        map(cart => {
            if (!!cart) {
                return true;
            }

            return router.createUrlTree(['/cart']);
        })
    )
}