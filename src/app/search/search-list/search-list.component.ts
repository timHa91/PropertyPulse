import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { SearchService } from "../search.service";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { SearchCriteria } from "../search-criteria.model";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-search-list',
    templateUrl: './search-list.component.html',
    styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit, OnDestroy {

    originalList: RealEstateItem[] = [];
    filteredList: RealEstateItem[] = [];

    subscripton!: Subscription

    constructor(private searchService: SearchService) {}

    ngOnInit(): void {
        this.originalList = this.searchService.getAllResults();
        this.filteredList = this.originalList;
        this.subscripton = this.searchService.onUpdateList.subscribe( searchCriteria => {
            this.filterList(searchCriteria);
        });
    }

    private filterList(criteria: SearchCriteria) {
        this.filteredList = this.originalList.filter(item => this.doesItemMeetCriteria(item, criteria));
        console.log(this.filteredList);
        
    }

    private doesItemMeetCriteria(item: RealEstateItem, criteria: SearchCriteria): boolean {
        if (!criteria.category || criteria.category.length <= 0) return false;

        let meetsCriteria = true;

        meetsCriteria = meetsCriteria && this.filterByCategory(item, criteria.category);
        if (criteria.location) meetsCriteria = meetsCriteria && this.filterByLocation(item, criteria.location);
        if (criteria.minPrice) meetsCriteria = meetsCriteria && this.filterByMinPrice(item, criteria.minPrice);
        if (criteria.maxPrice) meetsCriteria = meetsCriteria && this.filterByMaxPrice(item, criteria.maxPrice);
        
        return meetsCriteria;
    }

    private filterByCategory(item: RealEstateItem, category: string[]): boolean {
        return category ? category.includes(item.category) : true;
    }

    private filterByLocation(item: RealEstateItem, location: string): boolean {
        return location ? item.address.toLowerCase().includes(location.toLowerCase()) : true;
    }

    private filterByMinPrice(item: RealEstateItem, minPrice: number): boolean {
        return minPrice ? item.price >= minPrice : true;
    }

    private filterByMaxPrice(item: RealEstateItem, maxPrice: number): boolean {
        return maxPrice ? item.price <= maxPrice : true;
    }

    ngOnDestroy(): void {
        this.subscripton.unsubscribe();
    }
}
