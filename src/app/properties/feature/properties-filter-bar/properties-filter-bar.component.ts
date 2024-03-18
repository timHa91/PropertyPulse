import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PropertiesCategoryFilterComponent } from "./properties-category-filter/properties-category-filter.component";
import { PropertiesLocationSearchComponent } from "./properties-location-search/properties-location-search.component";
import { PropertiesPriceRangeFilterComponent } from "./properties-price-range-filter/properties-price-range-filter.component";
import { PropertiesRadiusFilterComponent } from "./properties-radius-filter/properties-radius-filter.component";
import { PropertiesFilter } from "../../model/properties-filter.model";
import { Category } from "src/app/shared/model/category.enum";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subscription } from 'rxjs';
import { PropertiesFilterService } from "../../service/properties-filter.service";
import { PropertiesFilterForm } from "../../model/properties-filter-form.model";

@Component({
    selector: 'app-properties-filter-bar',
    templateUrl: './properties-filter-bar.component.html',
    styleUrls: ['./properties-filter-bar.component.css']
})
export class PropertiesFilterBarComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(PropertiesCategoryFilterComponent) categoryFilter?: PropertiesCategoryFilterComponent;
    @ViewChild(PropertiesLocationSearchComponent) locationSearch?: PropertiesLocationSearchComponent;
    @ViewChild(PropertiesPriceRangeFilterComponent) priceRange?: PropertiesPriceRangeFilterComponent;
    @ViewChild(PropertiesRadiusFilterComponent) radiusFilter?: PropertiesRadiusFilterComponent;

    searchForm!: FormGroup;
    private subscription!: Subscription;

    constructor(private filterService: PropertiesFilterService) {}

    ngOnInit(): void {
        this.searchForm = new FormGroup({});
    
        this.subscription = this.searchForm.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(searchForm => {
            const convertedSearchForm = this.transformToSearchCriteria(searchForm);
            this.filterService.onFilterList$.next(convertedSearchForm);
            this.updateLocationFilter(convertedSearchForm);
        });
    }

    // Add Child Controls after View init 
    ngAfterViewInit(): void {
        this.searchForm.addControl('category', this.categoryFilter?.categoryForm);
        this.searchForm.addControl('location', this.locationSearch?.locationForm);
        this.searchForm.addControl('price', this.priceRange?.priceForm);
        this.searchForm.addControl('radius', this.radiusFilter?.radiusForm);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private transformToSearchCriteria(searchForm: PropertiesFilterForm): PropertiesFilter {
        const searchCriteria = new PropertiesFilter();

        if (searchForm.category) {
            searchCriteria.category = this.transformToCategoryArray(searchForm.category);
        }

        if (searchForm.location) {
            searchCriteria.location = searchForm.location.location;
        }

        if (searchForm.price) {
            searchCriteria.minPrice = searchForm.price.minPrice;
            searchCriteria.maxPrice = searchForm.price.maxPrice;
        }

        if (searchForm.radius) {
            searchCriteria.radius = searchForm.radius.radius;
        }
        return searchCriteria;
    }

    private transformToCategoryArray(searchCategory: { [key: string]: boolean; }) {
        const categoryArray: Category[] = [];
           Object.entries(searchCategory).forEach(([key, value]) => {
                if (value === true) {
                    const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
                    categoryArray.push(Category[upperCaseKey as keyof typeof Category])
                }
            });
            return categoryArray;
    }

    private updateLocationFilter(convertedSearchForm: PropertiesFilter): void {
        if (convertedSearchForm.location && convertedSearchForm.location !== '') {
            this.filterService.filterHasLocation$.next({
                hasValue: true, 
                locationValue: convertedSearchForm.location
            });
        } else {
            this.filterService.filterHasLocation$.next({
                hasValue: false, 
                locationValue: ''
            });
        }
    }
    
}
