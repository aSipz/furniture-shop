import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";

import { UserService } from "src/app/user/user.service";

export const authActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

    const router = inject(Router);
    const userService = inject(UserService);

    return userService.user$.pipe(
        take(1),
        map(user => {

            const loginRequired = route.data['loginRequired'];
            if (loginRequired === undefined || !!user === loginRequired) {
                return true;
            }

            const returnUrl = state.url;

            return !!user
                ? router.createUrlTree(['/themes'])
                : router.createUrlTree(['/user/login'], { queryParams: { returnUrl } });
        })
    )
}