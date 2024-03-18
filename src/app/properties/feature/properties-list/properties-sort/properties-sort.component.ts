import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { PropertiesSortDirection } from "../../../model/properties-sort-descriptor.model";
import { PropertiesSortService } from "../../../service/properties-sort.service";
import { PropertiesFilterService } from "../../../service/properties-filter.service";

@Component({
    selector: 'app-properties-sort',
    templateUrl: './properties-sort.component.html',
    styleUrls: ['./properties-sort.component.css']
})
export class PropertiesSortComponent implements OnInit, OnDestroy {
    selected = new FormControl('price');
    rotate = true;
    direction = PropertiesSortDirection.Ascending;
    isDistance = true;
    location = '';

    private subscriptions: Subscription[] = [];

    constructor (
        private sortService: PropertiesSortService,
        private filterService: PropertiesFilterService
    ) {}

    ngOnInit(): void {
        this.subscribeToSelectedValueChanges();
        this.subscribeToSortReset();
        this.subscribeToFilterLocation();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }

    private subscribeToSelectedValueChanges(): void {
        this.subscriptions.push(
            this.selected.valueChanges.subscribe(selectedCategory => {
                if(selectedCategory)
                this.sortService.triggerSort$.next({
                    category: selectedCategory, 
                    direction: this.direction, 
                    location: this.location
                });
            })
        );
    }

    private subscribeToSortReset(): void {
        this.subscriptions.push(
            this.sortService.onReset$.subscribe(() => {
                this.resetSort();
            })
        );
    }

    private subscribeToFilterLocation(): void {
        this.subscriptions.push(
            this.filterService.filterHasLocation$.subscribe(value => {
                this.isDistance = !value.hasValue;
                this.location = value.locationValue;
            })
        );
    }

    private resetSort(): void {
        this.rotate = !this.rotate;
        this.direction = PropertiesSortDirection.Ascending;
        this.selected.setValue('price');
    }

    toggleSortDirection(): void {
        this.direction = this.direction === PropertiesSortDirection.Ascending
            ? PropertiesSortDirection.Descending
            : PropertiesSortDirection.Ascending;
        if(this.selected.value)
        this.sortService.triggerSort$.next({
            category: this.selected.value, 
            direction: this.direction,
            location: this.location
        });
    }

    private unsubscribeAll(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
