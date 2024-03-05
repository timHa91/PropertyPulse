import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ViewportService } from "../viewport.service";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    isSmallView = false;
    viewportSubscription!: Subscription;

    constructor(private viewportService: ViewportService) {}

    ngOnInit(): void {
        this.viewportSubscription = this.viewportService.isSmallView$
        .subscribe((isStateMatched: boolean) => {
            this.isSmallView = isStateMatched;
        });
    }   
    
    ngOnDestroy(): void {
        this.viewportSubscription.unsubscribe();
    }
}