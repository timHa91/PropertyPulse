import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{

    authForm!: FormGroup;
    isLogin = false;
    constructor(private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.isLogin = params['type'] === 'login';
        });
        this.authForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.min(6)])
        })
    }

    onAuth() {
        if (this.isLogin) {
            console.log('login');
            
        } else {
            console.log('signUp');
            
        }
    }

    onSwitchMode() {
        this.isLogin = !this.isLogin;
    }

    onCancelAuth() {
        this.resetForm();
        this.router.navigate(['marketplace-search'])
    }

    private resetForm () {
        this.authForm.reset();
    }
}