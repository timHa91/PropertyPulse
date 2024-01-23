import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SortDirection } from "./sort-descriptor.model";
import { SortService } from "./sort.service";
import { FilterService } from "../../filter-bar/filter.service";

@Component({
    selector: 'app-search-list-sort',
    templateUrl: './search-list-sort.component.html',
    styleUrls: ['./search-list-sort.component.css']
})
export class SearchSortComponent implements OnInit{
    selected: FormControl = new FormControl('price')
    rotate = true;
    selectedDirection: string = SortDirection.Ascending;
    isDistance = true;
    location = '';

    constructor (private sortService: SortService,
                 private filterService: FilterService
        ) {}

    ngOnInit(): void {
        this.selected.valueChanges.subscribe(selectedCategory => {
            this.sortService.triggerSort$.next({
                category: selectedCategory, 
                direction: this.selectedDirection, 
                location: this.location});
        });
        this.sortService.triggerReset$.subscribe(() => {
            this.resetSort();
        });
        this.filterService.filterHasLocation$.subscribe(value => {
            this.isDistance = !value.hasValue;
            this.location = value.locationValue;
        });
    }

    resetSort() {
        this.selectedDirection === SortDirection.Descending ? this.rotate = !this.rotate : this.rotate;
        this.selectedDirection = SortDirection.Ascending;
        this.selected.setValue('price');
    }

    toggleSortDirection() {
        this.rotate = !this.rotate;
        if (this.selectedDirection === SortDirection.Ascending) {
            this.selectedDirection = SortDirection.Descending;
        } else {
            this.selectedDirection = SortDirection.Ascending;
        }
        const selectedCategory = this.selected.value;
        this.sortService.triggerSort$.next({
            category: selectedCategory, 
            direction: this.selectedDirection,
            location: this.location
        })
    }
    
}