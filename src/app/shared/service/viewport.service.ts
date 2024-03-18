import { BreakpointObserver } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable({providedIn: 'root'})
export class ViewportService {
    
    isSmallView$: Observable<boolean>;
    smallBreakpoint = '(max-width: 1500px)';
    
    constructor (private responsive: BreakpointObserver) {
        this.isSmallView$ = this.responsive
        .observe(this.smallBreakpoint)
        .pipe(map(state => state.matches));
    }
}