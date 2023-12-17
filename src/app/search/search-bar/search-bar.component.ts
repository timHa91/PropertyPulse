import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CategoryFilterComponent } from "./category-filter/category-filter.component";
import { LocationSearchComponent } from "./location-search/location-search.component";
import { PriceRangeFilterComponent } from "./price-range-filter/price-range-filter.component";
import { RadiusFilterComponent } from "./radius-filter/radius-filter.component";
import { SearchService } from "../search.service";
import { SearchCriteria } from "../search.model";
import { Category } from "src/app/shared/category.enum";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements AfterViewInit {
    @ViewChild(CategoryFilterComponent) categoryFilter!: CategoryFilterComponent;
    @ViewChild(LocationSearchComponent) locationSearch!: LocationSearchComponent;
    @ViewChild(PriceRangeFilterComponent) priceRange!: PriceRangeFilterComponent;
    @ViewChild(RadiusFilterComponent) radiusFilter!: RadiusFilterComponent;

    searchForm!: FormGroup;

    constructor(private searchService: SearchService) {};
    
    ngAfterViewInit(): void {
        this.searchForm = new FormGroup({
            'category': this.categoryFilter?.categoryForm,
            'location': this.locationSearch?.locationForm,
            'price': this.priceRange?.priceForm,
            'radius': this.radiusFilter?.radiusForm
        })

        this.searchForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe(searchForm => {
            const convertedSearchForm = this.transformToSearchCriteria(searchForm);
            this.searchService.onUpdateList.next(convertedSearchForm);
          });   
    }

    private transformToSearchCriteria(obj: any): SearchCriteria {
            let searchCriteria: SearchCriteria = new SearchCriteria();

            if (obj.category) {
                let categoryArray: Category[] = [];
                Object.entries(obj.category).forEach(([key, value]) => {
                    if (value === true) {
                        let upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
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