import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuthRequest } from "./auth-request.model";
import { AuthResponse } from "./auth-response.model";
import { User } from "./user.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl: string = environment.firebase.authUrl;
  private loginUrl: string = environment.firebase.loginUrl;
  private apiKey: string = environment.firebase.apiKey;
  private tokenExpirationTimer: any;

  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  userLoggedOut: Subject<void> = new Subject<void>();
  userLoggedIn: BehaviorSubject<void | null> = new BehaviorSubject<void | null>(null);

  constructor(private http: HttpClient) {}

  signUp(newUser: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl + this.apiKey}`, { ...newUser, returnSecureToken: true })
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        tap((response: AuthResponse) => this.handleAuth(response))
      );
  }

  login(user: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.loginUrl + this.apiKey}`, { ...user, returnSecureToken: true })
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        tap((response: AuthResponse) => this.handleAuth(response))
      );
  }

  logout(): void {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
    this.userLoggedOut.next();
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  autoLogin(): void {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) return;

    const loadedUser: User = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      const expirationDuration: number = +new Date(userData._tokenExpirationDate).getTime() - +new Date().getTime();
      this.user.next(loadedUser);
      this.autoLogout(expirationDuration);
    }
  }

  private handleAuth(response: AuthResponse): void {
    const expirationDate: Date = new Date(new Date().getTime() + +response.expiresIn * 1000);
    const loggedUser: User = new User(
      response.email,
      response.localId,
      response.idToken,
      expirationDate
    );
    this.user.next(loggedUser);
    this.userLoggedIn.next();
    this.autoLogout(+response.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(loggedUser));
  }

  private handleError(errorResp: HttpErrorResponse): Observable<never> {
    console.error(errorResp);
    let errorMessage = 'An unknown error occurred!';
    if (errorResp.error && errorResp.error.error) {
      switch (errorResp.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists.';
          break;
        case 'INVALID_LOGIN_CREDENTIALS':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
      }
    }
    return throwError(() => errorMessage);
  }
}
