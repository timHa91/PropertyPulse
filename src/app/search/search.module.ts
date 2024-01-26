import { NgModule } from "@angular/core";
import { SearchComponent } from "./search.component";
import { CategoryFilterComponent } from "./filter-bar/category-filter/category-filter.component";
import { PriceRangeFilterComponent } from "./filter-bar/price-range-filter/price-range-filter.component";
import { RadiusFilterComponent } from "./filter-bar/radius-filter/radius-filter.component";
import { SearchBarComponent } from "./filter-bar/filter-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LocationSearchComponent } from "./filter-bar/location-search/location-search.component";
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from "@angular/common";
import { SearchListComponent } from "./search-list/search-list.component";
import { SearchDetailComponent } from "./search-list/search-detail/search-detail.component";
import { SearchSortComponent } from "./search-list/search-list-sort/search-list-sort.component";
import { SearchItemComponent } from "./search-list/search-item/search-item.component";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MapComponent } from "../map/map.component";
import {HttpClientModule} from '@angular/common/http'
import { PaginationControlsComponent } from "../pagination/pagination-controls/pagination-controls.component";
import {MatSelectModule} from '@angular/material/select';



@NgModule({
    declarations: [
        SearchComponent,
        CategoryFilterComponent,
        PriceRangeFilterComponent,
        RadiusFilterComponent,
        SearchBarComponent,
        LocationSearchComponent,
        SearchListComponent,
        SearchDetailComponent,
        SearchSortComponent,
        SearchItemComponent,
        MapComponent,
        PaginationControlsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSliderModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        HttpClientModule,
        MatSelectModule
    ]
})
export class SearchModule {
}