import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: true,
    imports: [ 
                MatMenuModule,
                BrowserModule,
                MatIconModule,
                MatIconModule,
                MatButtonModule,
                BrowserAnimationsModule
            ]
})
export class MenuComponent implements OnInit, OnDestroy{

    authSubscription!: Subscription;
    isAuthenticated = false;

    constructor (private router: Router,
                 private authService: AuthService) {}

    ngOnInit(): void {
        this.authSubscription = this.authService.user.subscribe( user => {
            this.isAuthenticated = !!user;
        })
    }

    goToListing() {
        this.router.navigate(['/marketplace-listing'])
    }

    goToSearch() {
        this.router.navigate(['/marketplace-search'])
    }

    goToSignUp() {
        this.router.navigate(['auth'])
    }

    goToLogin() {
        this.router.navigate(['auth'], {queryParams: {login: 'true'}})
    }

    onLogout() {
        console.log('hih');
        
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}