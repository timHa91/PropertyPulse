import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { RealEstateItem } from 'src/app/shared/real-estate-item.model';
import { Subscription } from 'rxjs';
import { FilterService } from '../filter-bar/filter.service';

@Component({
  selector: 'app-listing-list',
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.css']
})
export class ListingListComponent implements OnInit, OnDestroy{

  orginalList: RealEstateItem[] = [];
  filteredList: RealEstateItem[] = [];
  listChangedSubscription!: Subscription;
  filterSubscription!: Subscription;

  constructor(private listingService: ListingService,
              private filterService: FilterService
    ) {}

  ngOnInit(): void {
    this.initLists();
    this.subscribeToListChanged();
    this.subscribeToFilter();
  }

  private initLists() {
    this.orginalList = this.listingService.getAllListings();
    this.filteredList = this.orginalList;
  }

  private subscribeToListChanged() {
    this.listChangedSubscription = this.listingService.listingHasChanged$.subscribe(changedList => {
      this.filteredList = changedList; 
    })
  }

  private subscribeToFilter() {
    this.filterSubscription = this.filterService.onFilterList$.subscribe(filterCritera => {
      this.filteredList = this.filterService.filterList(this.orginalList, filterCritera);
    })
  }

  ngOnDestroy(): void {
    this.listChangedSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }
}
