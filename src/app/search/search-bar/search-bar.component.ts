import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CategoryFilterComponent } from "./category-filter/category-filter.component";
import { LocationSearchComponent } from "./location-search/location-search.component";
import { PriceRangeFilterComponent } from "./price-range-filter/price-range-filter.component";
import { RadiusFilterComponent } from "./radius-filter/radius-filter.component";
import { SearchService } from "../search.service";
import { SearchCriteria } from "../search-criteria.model";
import { Category } from "src/app/shared/category.enum";
import { debounceTime } from "rxjs/operators";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
    @ViewChild(CategoryFilterComponent) categoryFilter?: CategoryFilterComponent;
    @ViewChild(LocationSearchComponent) locationSearch?: LocationSearchComponent;
    @ViewChild(PriceRangeFilterComponent) priceRange?: PriceRangeFilterComponent;
    @ViewChild(RadiusFilterComponent) radiusFilter?: RadiusFilterComponent;

    searchForm!: FormGroup;
    private subscription!: Subscription;

    constructor(private searchService: SearchService) {}

    ngOnInit(): void {
        this.searchForm = new FormGroup({});

        this.subscription = this.searchForm.valueChanges
        .pipe(
            debounceTime(500)
        )
        .subscribe(searchForm => {
            const convertedSearchForm = this.transformToSearchCriteria(searchForm);
            this.searchService.onUpdateList.next(convertedSearchForm);
        });
    }

    ngAfterViewInit(): void {
        this.searchForm.addControl('category', this.categoryFilter?.categoryForm);
        this.searchForm.addControl('location', this.locationSearch?.locationForm);
        this.searchForm.addControl('price', this.priceRange?.priceForm);
        this.searchForm.addControl('radius', this.radiusFilter?.radiusForm);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private transformToSearchCriteria(obj: any): SearchCriteria {
        const searchCriteria = new SearchCriteria();

        if (obj.category) {
            // Umwandlung Category Object aus dem Form in ein Category[]
            const categoryArray: Category[] = [];
            Object.entries(obj.category).forEach(([key, value]) => {
                if (value === true) {
                    const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
                    categoryArray.push(Category[upperCaseKey as keyof typeof Category])
                }
            });
            searchCriteria.category = categoryArray;
        }

        if (obj.location) {
            searchCriteria.location = obj.location.location;
        }

        if (obj.price) {
            searchCriteria.minPrice = obj.price.minPrice;
            searchCriteria.maxPrice = obj.price.maxPrice;
        }

        if (obj.radius) {
            searchCriteria.radius = obj.radius.radius;
        }

        return searchCriteria;
    }
}
