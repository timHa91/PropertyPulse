import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SortDirection } from "./search-list-sort.model";
import { Subject } from "rxjs";
import { SortService } from "../../sort.service";

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
  
    @Input() hasLocation!: Subject<{hasValue: boolean, locationValue: string}>;

    constructor (private sortService: SortService) {}

    ngOnInit(): void {
        this.selected.valueChanges.subscribe(selectedCategory => {
            this.sortService.triggerSort.next({
                category: selectedCategory, 
                direction: this.selectedDirection, 
                location: this.location});
        });
        this.sortService.triggerReset.subscribe(() => {
            this.resetSort();
        });
        this.hasLocation.subscribe(value => {
            this.isDistance = value.hasValue;
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
        this.sortService.triggerSort.next({
            category: selectedCategory, 
            direction: this.selectedDirection,
            location: this.location
        })
    }
    
}