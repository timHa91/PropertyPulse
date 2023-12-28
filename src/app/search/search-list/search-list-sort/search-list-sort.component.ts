import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SortDescriptor, SortDirection } from "./search-list-sort.model";
import { Subject } from "rxjs";

@Component({
    selector: 'app-search-list-sort',
    templateUrl: './search-list-sort.component.html',
    styleUrls: ['./search-list-sort.component.css']
})
export class SearchSortComponent implements OnInit{
    selected: FormControl = new FormControl('price')
    rotate = true;
    selectedDirection: string = SortDirection.Ascending;
    isDistance: boolean = true;
    @Output() triggerSort = new EventEmitter<SortDescriptor>();
    @Input() triggerReset!: Subject<void>;
    @Input() hasLocation!: Subject<boolean>;

    ngOnInit(): void {
        this.selected.valueChanges.subscribe(selectedCategory => {
            this.triggerSort.emit({category: selectedCategory, direction: this.selectedDirection});
        });
        this.triggerReset.subscribe(() => {
            this.resetSort();
        });
        this.hasLocation.subscribe(value => {
            this.isDistance = value;
        });
    }

    resetSort() {
        this.selectedDirection === SortDirection.Descending ? this.rotate = !this.rotate : this.rotate = this.rotate;
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
        this.triggerSort.emit({category: selectedCategory, direction: this.selectedDirection})
    }
}