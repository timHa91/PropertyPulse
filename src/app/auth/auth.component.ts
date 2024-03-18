import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthRequest } from "./auth-request.model";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { AuthResponse } from "./auth-response.model";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  authForm!: FormGroup;
  isLogin = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.handleQueryParams();
  }

  initializeForm(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  handleQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      this.isLogin = !!params['login'];
    });
  }

  onAuth(): void {
    this.isLoading = true;
    if (this.authForm.valid) {
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      const user: AuthRequest = { email, password };
  
      let authObs: Observable<AuthResponse>;
  
      if (this.isLogin) {
        authObs = this.authService.login(user);
      } else {
        authObs = this.authService.signUp(user);
      }
  
      authObs.subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/properties']);
        },
        error: error => {
          this.handleError(error);
        }
      });
    }
    this.resetForm();
  }  

  handleError(error: Error): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.errorMessage = 'Unauthorized. Please check your credentials.';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    this.isLoading = false;
  }

  onSwitchMode(): void {
    this.isLogin = !this.isLogin;
  }

  onCancelAuth(): void {
    this.resetForm();
    this.router.navigate(['properties']);
  }

  resetForm(): void {
    this.authForm.reset();
  }
}
