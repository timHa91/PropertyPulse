import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CategoryFilterComponent } from "./category-filter/category-filter.component";
import { LocationSearchComponent } from "./location-search/location-search.component";
import { PriceRangeFilterComponent } from "./price-range-filter/price-range-filter.component";
import { RadiusFilterComponent } from "./radius-filter/radius-filter.component";
import { SearchCriteria } from "../search-criteria.model";
import { Category } from "src/app/shared/category.enum";
import { debounceTime } from "rxjs/operators";
import { Subscription } from 'rxjs';
import { FilterService } from "./filter.service";
import { FilterForm } from "./filter-form.model";

@Component({
    selector: 'app-filter-bar',
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(CategoryFilterComponent) categoryFilter?: CategoryFilterComponent;
    @ViewChild(LocationSearchComponent) locationSearch?: LocationSearchComponent;
    @ViewChild(PriceRangeFilterComponent) priceRange?: PriceRangeFilterComponent;
    @ViewChild(RadiusFilterComponent) radiusFilter?: RadiusFilterComponent;

    searchForm!: FormGroup;
    private subscription!: Subscription;

    constructor(private filterService: FilterService) {}

    ngOnInit(): void {
        this.searchForm = new FormGroup({});

        this.subscription = this.searchForm.valueChanges
        .pipe(
            debounceTime(500)
        )
        .subscribe(searchForm => {
            const convertedSearchForm = this.transformToSearchCriteria(searchForm);
            this.filterService.onFilterList$.next(convertedSearchForm);
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

    private transformToSearchCriteria(searchForm: FilterForm): SearchCriteria {
        const searchCriteria = new SearchCriteria();

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
}
