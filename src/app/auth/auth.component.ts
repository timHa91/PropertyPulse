import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthRequest } from "./auth-request.model";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { AuthResponse } from "./auth-response.model";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{

    authForm!: FormGroup;
    isLogin = false;
    isLoading = false;
    errorMessage: string | null = null;
     
    constructor(private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.isLogin = params['login'];
        });
        this.authForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.min(6)])
        })
    }

    onAuth() {
        this.isLoading = true;
        if (this.authForm.valid) {
            const email = this.authForm.value.email;
            const password = this.authForm.value.password;
            const user : AuthRequest = {
                email: email,
                password: password
            }
            
            let authObs: Observable<AuthResponse>;

            if (this.isLogin) {
               authObs = this.authService.login(user)
            } else {
                authObs = this.authService.signUp(user)
            }

            authObs.subscribe({
                next: response => {
                    this.isLoading = false;
                    this.router.navigate(['/properties']);
            },
                error: errorMsg => {
                    this.errorMessage = errorMsg;
                    this.isLoading = false;
                }
            })
        }
        this.authForm.reset();
    }

    onSwitchMode() {
        this.isLogin = !this.isLogin;
    }

    onCancelAuth() {
        this.resetForm();
        this.router.navigate(['properties'])
    }

    private resetForm () {
        this.authForm.reset();
    }

}