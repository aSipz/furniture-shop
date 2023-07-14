import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Provider } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, of, switchMap, take, throwError, zip, timer, retry } from "rxjs";

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

        return next.handle(req)
            .pipe(
                retry({ count: 2, delay: this.shouldRetry }),
                catchError(err => of(err)
                    .pipe(
                        switchMap(err => {
                            if (err.status === 0 || err.status === 500) {
                                this.apiError.next(err);
                                this.router.navigate(['/error']);
                                const msg = err.status === 0 ? 'Unable to connect to server!' : 'Internal Server Error';
                                return throwError(() => msg);
                            }

                            if (err.status === 401) {
                                return [[err, null]]
                            }
                            return zip([err], this.userService.user$).pipe(take(1));
                        }),
                        switchMap(([err, user]) => {
                            if (err.status === 401 && user) {
                                this.apiError.next(err);
                                this.router.navigate(['/error']);
                            }

                            return throwError(() => err);
                        })

                    )
                )
            );
    }

    shouldRetry(error: HttpErrorResponse) {
        if (error.status >= 500 || error.status == 0) {
            return timer(1500);
        }
        throw error;
    }

};

export const appInterceptorProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AppInterceptor,
    multi: true
}