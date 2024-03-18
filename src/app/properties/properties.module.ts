import { NgModule } from "@angular/core";
import { PropertiesComponent } from "./properties.component";
import { PropertiesCategoryFilterComponent } from "./feature/properties-filter-bar/properties-category-filter/properties-category-filter.component";
import { PropertiesPriceRangeFilterComponent } from "./feature/properties-filter-bar/properties-price-range-filter/properties-price-range-filter.component";
import { PropertiesRadiusFilterComponent } from "./feature/properties-filter-bar/properties-radius-filter/properties-radius-filter.component";
import { PropertiesFilterBarComponent } from "./feature/properties-filter-bar/properties-filter-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PropertiesLocationSearchComponent } from "./feature/properties-filter-bar/properties-location-search/properties-location-search.component";
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from "@angular/common";
import { PropertiesListComponent } from "./feature/properties-list/properties-list.component";
import { PropertiesDetailComponent } from "./feature/properties-list/properties-detail/properties-detail.component";
import { PropertiesSortComponent } from "./feature/properties-list/properties-sort/properties-sort.component";
import { PropertiesItemComponent } from "./feature/properties-list/properties-item/properties-item.component";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MapComponent } from "../mapbox/mapbox.component";
import {HttpClientModule} from '@angular/common/http'
import { PaginationControlsComponent } from "../pagination/pagination-controls/pagination-controls.component";
import {MatSelectModule} from '@angular/material/select';
import { RouterModule } from "@angular/router";
import { AuthModule } from "../auth/auth.module";
import { MenuComponent } from "../menu/menu.component";

@NgModule({
    declarations: [
        PropertiesComponent,
        PropertiesCategoryFilterComponent,
        PropertiesPriceRangeFilterComponent,
        PropertiesRadiusFilterComponent,
        PropertiesFilterBarComponent,
        PropertiesLocationSearchComponent,
        PropertiesListComponent,
        PropertiesDetailComponent,
        PropertiesSortComponent,
        PropertiesItemComponent,
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
        MatSelectModule,
        RouterModule,
        AuthModule,
        MenuComponent
    ]
})
export class PropertiesModule {

}