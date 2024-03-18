import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ViewportService } from "../shared/service/viewport.service";

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit, OnDestroy {
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
