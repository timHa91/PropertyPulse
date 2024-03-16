import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { RealEstateItem } from 'src/app/shared/real-estate-item.model';
import { Subscription } from 'rxjs';
import { FilterService } from '../filter-bar/filter.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

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
  logOutSubscription!: Subscription;
  constructor(private listingService: ListingService,
              private filterService: FilterService,
              private authService: AuthService,
              private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.initList();
    this.subscribeToListChanged();
    this.subscribeToFilter();
    this.subscribeToUserLogOut();
  }

  private initList() {
    this.route.data.subscribe(data => {
      this.orginalList = data['listingData'];
      this.filteredList = this.orginalList;
    })
}

  private subscribeToUserLogOut() {
    this.logOutSubscription = this.authService.userLoggedOut.subscribe(() => {
      this.listingService.resetUserList();
    });
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
    this.logOutSubscription.unsubscribe();
  }
}
