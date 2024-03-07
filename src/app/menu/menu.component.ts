import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {

    constructor (private router: Router) {}


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
        this.router.navigate(['auth'], {queryParams: {type: 'login'}})
    }
}