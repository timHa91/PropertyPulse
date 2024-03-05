import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Subject, of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { SearchService } from "../search.service";
import { MapboxService } from "src/app/mapbox/mapbox.service";
import { PaginationService } from "../../pagination/pagination.service";
import { FilterService } from "../filter-bar/filter.service";
import { SortService } from "./search-list-sort/sort.service";

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit, OnDestroy {

  originalList: RealEstateItem[] = [];
  filteredList: RealEstateItem[] = [];
  paginatedList: RealEstateItem[] = [];
  hasLocationValue = new Subject<{ hasValue: boolean, locationValue: string }>();
  isDistanceSort = false;
  filterSubscription!: Subscription;
  sortSubscription!: Subscription;
  paginationSubscription!: Subscription;
  searchListChangedSubscription!: Subscription;
  updateMapSubscription!: Subscription;
  isDetailView = false;
  detailViewItem!: RealEstateItem;

  constructor(
    private searchService: SearchService,
    private mapService: MapboxService,
    private paginationService: PaginationService,
    private filterService: FilterService,
    private sortService: SortService
  ) {}

  ngOnInit(): void {
    this.initializeLists();
    this.subscribeToSortChanges();
    this.subscribeToFilterChanges();
    this.subscribeToPaginationChanges();
    this.subscribeToSearchListChanges();
    this.subscribeToUpdateMap();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  onDetailView(item: RealEstateItem) {
    this.detailViewItem = item;
    this.isDetailView = true;
  }

  onCloseDetailView() : void {
    this.isDetailView = false;
  }

  private initializeLists() {
    this.originalList = this.searchService.getAllResults();
    this.filterService.setPriceRangeFromList(this.originalList);
    this.filteredList = this.originalList;
  }

  private updateMap() {
      this.mapService.updateMapCenter(this.filteredList);
      this.mapService.placeAllMarkers(this.paginatedList);
  }

  private subscribeToUpdateMap() {
    this.updateMapSubscription = this.mapService.updateMap.subscribe( () => {
      this.updateMap();
    })
  }

  private subscribeToSearchListChanges() {
    this.searchListChangedSubscription = this.searchService.searchListHasChanged.subscribe(changedList => {
      this.originalList = changedList;
      this.filterService.setPriceRangeFromList(this.originalList);
      this.filteredList = this.originalList;
    })
  }

  private subscribeToFilterChanges() {
    this.filterSubscription = this.filterService.onFilterList$.pipe(
      switchMap(searchCriteria =>
        this.filterService.filterList(this.originalList, searchCriteria)),
      catchError(this.handleError)
    ).subscribe(filteredList => {
      this.handleFilteredListChanges(filteredList);
    });
  }

  private subscribeToSortChanges() {
    this.sortSubscription = this.sortService.triggerSort$.pipe(
      switchMap(sortDescriptor =>
        this.sortService.sortList(this.filteredList, sortDescriptor)),
      catchError(this.handleError)
    ).subscribe(sortedList => {
        this.handleSortListChanges(sortedList);
    });
  }

  private subscribeToPaginationChanges() {
    this.paginationSubscription = this.paginationService.onPaginationChanged$.subscribe(() => {
        this.handlePaginationChanges();
    });
  }

  private handlePaginationChanges() {
    this.paginatedList = this.paginationService.setPaginationList(this.filteredList);
    this.updateMapMarkers();
  }

  private handleSortListChanges(sortedList: RealEstateItem[]) {
    this.paginationService.onReset$.next();
    this.paginatedList = this.paginationService.setPaginationList(sortedList);
    this.updateMapMarkers();
  }

  private handleFilteredListChanges(filteredList: RealEstateItem[]) { 
    this.filteredList = filteredList;
    this.paginatedList = this.paginationService.setPaginationList(filteredList);
    this.updateMapMarkers();
    this.sortService.onReset$.next();
    this.paginationService.onReset$.next();
  }

  private updateMapMarkers() {
    this.mapService.removeAllMarkers();
    this.mapService.placeAllMarkers(this.paginatedList);
  }

  private handleError(error: any) {
    console.log(error);
    return of([]);
  }

  private unsubscribeAll() {
    this.filterSubscription.unsubscribe();
    this.sortSubscription.unsubscribe();
    this.paginationSubscription.unsubscribe();
    this.updateMapSubscription.unsubscribe();
  }
}
