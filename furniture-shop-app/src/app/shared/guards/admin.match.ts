import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";

import { UserService } from "src/app/user/user.service";

export const adminMatch: CanMatchFn = (
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

    const router = inject(Router);
    const userService = inject(UserService);

    return userService.user$.pipe(
        take(1),
        map(user => {

            const adminRequired = route?.data?.['adminRequired'];
            if (adminRequired && user?.userRights === 'admin') {
                return true;
            }

            const returnUrl = segments.map(e => e.path).join('/');

            return !!user
                ? router.createUrlTree(['/'])
                : router.createUrlTree(['/user/login'], { queryParams: { returnUrl } });
        })
    )
}