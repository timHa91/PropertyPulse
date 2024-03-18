import { inject } from "@angular/core"
import { AuthService } from "../service/auth.service"
import { map, take } from "rxjs";
import { Router } from "@angular/router";

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.user.pipe(
        take(1),
        map( user => {
            const isAuth = !!user;
            if (isAuth) return router.createUrlTree(['/properties']);
            return true;
          })
    )
}