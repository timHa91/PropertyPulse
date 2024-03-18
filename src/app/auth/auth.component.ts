import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthRequest } from "./model/auth-request.model";
import { AuthService } from "./service/auth.service";
import { Observable } from "rxjs";
import { AuthResponse } from "./model/auth-response.model";

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
    this.handleQueryParams();
  }

  initForm(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', 
      [
        Validators.required, this.isLogin ? Validators.nullValidator : Validators.minLength(6)
      ])
    });
  }

  handleQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      this.isLogin = !!params['login'];
      this.initForm();
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
          this.errorMessage = error;
          this.isLoading = false;
        }
      });
    }
    this.resetForm();
  }  

  onSwitchMode(): void {
    this.isLogin = !this.isLogin;
    this.initForm();
  }

  onCancelAuth(): void {
    this.resetForm();
    this.router.navigate(['properties']);
  }

  resetForm(): void {
    this.authForm.reset();
  }
}
