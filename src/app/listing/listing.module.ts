import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingComponent } from './listing.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { ListingListComponent } from './listing-list/listing-list.component';
import { ListingItemComponent } from './listing-item/listing-item.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    ListingComponent,
    FilterBarComponent,
    ListingListComponent,
    ListingItemComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class ListingModule { }
