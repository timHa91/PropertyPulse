import { inject } from "@angular/core"
import { map, take } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";

export const userGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.user.pipe(
        take(1),
        map( user => {
            const isAuth = !!user;
            if (isAuth) {
                return true;
            }
            return router.createUrlTree(['/auth'])
          })
    )
}