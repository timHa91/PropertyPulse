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

    user = new BehaviorSubject<User | null>(null);

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

    private handleAuth = (response: AuthResponse) => {
        const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
        const logedInUser = new User(
            response.email,
            response.localId,
            response.idToken,
            expirationDate
        );
        console.log('next');
        
        this.user.next(logedInUser);
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