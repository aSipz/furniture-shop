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
        // return next.handle(req).pipe(
        //     catchError(err => {
        //         if (err.status === 401) {
        //             this.router.navigate(['/user/login']);
        //         } else {
        //             this.apiError.next(err);
        //         }
        //         return throwError(() => err);
        //     })
        // );
        return next.handle(req)
            .pipe(
                catchError(err => of(err)
                    .pipe(
                        switchMap(err => {
                            if (err.status === 401) {
                                return [[err, null]]
                            }
                            return zip([err], this.userService.user$).pipe(take(1));
                        }),
                        switchMap(([err, user]) => {
                            if (err.status === 401) {
                                if (!user) {
                                    this.router.navigate(['/user/login']);
                                } else {
                                    this.router.navigate(['/no-permission']);
                                }
                            } else {
                                this.apiError.next(err);
                                this.router.navigate(['/error']);
                            }
                            // let errorMsg = '';
                            // console.log(err);
                            
                            // if (err.error instanceof ErrorEvent) {
                            //     console.log('This is client side error');
                            //     errorMsg = `Error: ${err.error.message}`;
                            // } else {
                            //     console.log('This is server side error');
                            //     errorMsg = `Error Code: ${err.status},  Message: ${err.statusText}`;
                            // }
                            // // console.log(errorMsg);
                            // return throwError(() => err);
                            return throwError(() => err);
                        })

                    )
                )
            );
    }

};

export const appInterceptorProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AppInterceptor,
    multi: true
}