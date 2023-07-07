import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Provider } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, of, switchMap, take, throwError, withLatestFrom, zip } from "rxjs";

import { environment } from 'src/environments/environment';
import { API_ERROR } from "./shared/constants";
import { UserService } from "./user/user.service";

const apiURL = environment.apiURL;

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(
        @Inject(API_ERROR) private apiError: BehaviorSubject<Error | null>,
        private router: Router,
        private userService: UserService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith('/api')) {
            req = req.clone({ url: req.url.replace('/api', apiURL), withCredentials: true });
        }
        return next.handle(req).pipe(
            catchError(err => {
                if (err.status === 401) {
                    this.router.navigate(['/user/login']);
                } else {
                    this.apiError.next(err);
                }
                return throwError(() => err);
            })
        );
    }

};

export const appInterceptorProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AppInterceptor,
    multi: true
}