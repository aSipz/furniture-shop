import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";

import { UserService } from "src/app/user/user.service";

export const authMatch: CanMatchFn = (
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

    const router = inject(Router);
    const userService = inject(UserService);

    return userService.user$.pipe(
        take(1),
        map(user => {

            const loginRequired = route?.data?.['loginRequired'];
            if (loginRequired === undefined || !!user === loginRequired) {
                return true;
            }

            const returnUrl = segments.map(e => e.path).join('/');

            return !!user
                ? router.createUrlTree(['/'])
                : router.createUrlTree(['/user/login'], { queryParams: { returnUrl } });
        })
    )
}