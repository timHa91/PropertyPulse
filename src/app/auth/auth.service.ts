import { Injectable } from "@angular/core";
import { AuthRequest } from "./auth-request.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthResponse } from "./auth-response.model";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";

@Injectable({providedIn: 'root'})
export class AuthService {

    private authUrl = environment.firebase.authUrl;
    private loginUrl = environment.firebase.loginUrl;
    private apiKey = environment.firebase.apiKey;
    private tokenExpirationTimer: any;
    user = new BehaviorSubject<User | null>(null);
    userLoggedOut = new BehaviorSubject<void | null>(null);
    userLoggedIn = new BehaviorSubject<void | null>(null);

    constructor(private http: HttpClient){}

    signUp(newUser: AuthRequest) {
      return this.http.post<AuthResponse>(`${this.authUrl + this.apiKey}`, { ...newUser, returnSecureToken: true})
      .pipe(catchError (this.handleError), 
      tap(this.handleAuth));
    }

    login(user: AuthRequest) {
        return this.http.post<AuthResponse>(`${this.loginUrl + this.apiKey}`, { ...user , returnSecureToken: true})
        .pipe(catchError (this.handleError), 
        tap(this.handleAuth));
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
        this.userLoggedOut.next();
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(this.logout , expirationDuration);
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExperationDate: string
        } = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData) return;

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExperationDate));
        if (loadedUser.token) {
            const expirationDuration = +new Date(userData._tokenExperationDate).getTime() - +new Date().getTime();
            this.user.next(loadedUser);            
            this.autoLogout(expirationDuration)
        }
    }

    private handleAuth = (response: AuthResponse) => {
        const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
        const loggedInUser = new User(
            response.email,
            response.localId,
            response.idToken,
            expirationDate
        );
        this.user.next(loggedInUser);
        this.userLoggedIn.next();
        this.autoLogout(+response.expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(loggedInUser));
    }

    private handleError(errorResp: HttpErrorResponse) {
        let errorMessage = 'An unknown Error occurred!'
        if (!errorResp.error || !errorResp.error.error) {
            return throwError(() => errorMessage);
        }
        switch(errorResp.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already.';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Invalid email or password. Please check your credentials and try again.';
                break;
        }
        return throwError(() => errorMessage);
    }
}   