import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, switchMap, take, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (user?.token) {
                    const modifiedReq = req.clone({
                        params: new HttpParams().set('auth', user?.token)
                    });
                    return next.handle(modifiedReq);
                } else {
                    return next.handle(req);
                }
            })
        );
    }
}
