import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingComponent } from './listing.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { ListingListComponent } from './listing-list/listing-list.component';
import { ListingItemComponent } from './listing-list/listing-item/listing-item.component';
import {MatCardModule} from '@angular/material/card';
import { CreateListingComponent } from './create-listing/create-listing.component';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';


@NgModule({
  declarations: [
    ListingComponent,
    FilterBarComponent,
    ListingListComponent,
    ListingItemComponent,
    CreateListingComponent
    ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    RouterModule,
    MenuComponent
  ]
})
export class ListingModule { }
