import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { MapboxService } from "../map/map.service";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

    isSmallView = false;

    constructor(private responsive: BreakpointObserver,
                private mapService: MapboxService) {}

    ngOnInit(): void {
        this.responsive.observe('(max-width: 1500px)')
        .subscribe((state: BreakpointState) => {
            if (state.matches) {
                this.isSmallView = true;
            } else {
                this.isSmallView = false;
            }
          });
    }

}