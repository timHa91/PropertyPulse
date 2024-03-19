import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subscription } from 'rxjs';

import { PropertiesCategoryFilterComponent } from "./properties-category-filter/properties-category-filter.component";
import { PropertiesLocationSearchComponent } from "./properties-location-search/properties-location-search.component";
import { PropertiesPriceRangeFilterComponent } from "./properties-price-range-filter/properties-price-range-filter.component";
import { PropertiesRadiusFilterComponent } from "./properties-radius-filter/properties-radius-filter.component";
import { PropertiesFilterService } from "../../service/properties-filter.service";
import { PropertiesFilter } from "../../model/properties-filter.model";
import { transformToSearchCriteria } from "../../utils/transform-to-search-criteria";

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

    constructor(
        private filterService: PropertiesFilterService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.subscribeToFormChanges();
    }

    ngAfterViewInit(): void {
        this.addFormControls();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initializeForm(): void {
        this.searchForm = this.formBuilder.group({});
    }

    private subscribeToFormChanges(): void {
        this.subscription = this.searchForm.valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(searchForm => {
                const convertedSearchForm = transformToSearchCriteria(searchForm);
                this.filterService.onFilterPropertiesList$.next(convertedSearchForm);
                this.updateLocationFilter(convertedSearchForm);
            });
    }

    private addFormControls(): void {
        this.searchForm.addControl('category', this.categoryFilter?.categoryForm);
        this.searchForm.addControl('location', this.locationSearch?.locationForm);
        this.searchForm.addControl('price', this.priceRange?.priceForm);
        this.searchForm.addControl('radius', this.radiusFilter?.radiusForm);
    }

    private updateLocationFilter(convertedSearchForm: PropertiesFilter): void {
        const locationValue = convertedSearchForm.location || '';
        this.filterService.filterHasLocation$.next({
            hasValue: !!convertedSearchForm.location,
            locationValue
        });
    }
}
