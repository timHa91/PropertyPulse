import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Subject, of, Observable } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

import { Property } from "src/app/shared/model/property.model";
import { PropertiesService } from "../../service/properties.service";
import { MapboxService } from "src/app/mapbox/mapbox.service";
import { PaginationService } from "../../../pagination/pagination.service";
import { PropertiesFilterService } from "../../service/properties-filter.service";
import { PropertiesSortService } from "../../service/properties-sort.service";
import { ActivatedRoute, Data } from "@angular/router";
import { PropertiesSortDescriptor } from "../../model/properties-sort-descriptor.model";
import { PropertiesFilter } from "../../model/properties-filter.model";

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css']
})
export class PropertiesListComponent implements OnInit, OnDestroy {

  // Lists
  originalList: Property[] = [];
  filteredList: Property[] = [];
  paginatedList: Property[] = [];

  // Flags
  isFetching = false;
  isDistanceSort = false;
  isDetailView = false;
  errorMessage: string | null = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Subjects
  hasLocationValue: Subject<{ hasValue: boolean, locationValue: string }> = new Subject<{ hasValue: boolean, locationValue: string }>();

  // Others
  detailViewItem!: Property;
 
  constructor(
    private propertiesService: PropertiesService,
    private mapService: MapboxService,
    private paginationService: PaginationService,
    private filterService: PropertiesFilterService,
    private sortService: PropertiesSortService,
    private route: ActivatedRoute  
  ) {}

  // Lifecycle Methods
  ngOnInit(): void {
    this.initializeLists();
    this.subscribeToSortChanges();
    this.subscribeToFilterChanges();
    this.subscribeToPaginationChanges();
    this.subscribeToPropertiesListChanges();
    this.subscribeToUpdateMap();
    this.subscribeToIsFetching();
    this.subscribeToError();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  // Detail View Methods
  onDetailView(item: Property): void {
    this.detailViewItem = item;
    this.isDetailView = true;
  }

  onCloseDetailView(): void {
    this.isDetailView = false;
  }

  // Subscribe Methods
  private subscribeToError(): void {
    this.subscriptions.push(this.propertiesService.onError$.subscribe((errorMsg: string) => {
      this.isFetching = false;
      this.errorMessage = errorMsg;
    }));
  }

  private subscribeToUpdateMap(): void {
    this.subscriptions.push(this.mapService.updateMap.subscribe(() => {
      this.updateMap();
    }));
  }

  private subscribeToIsFetching(): void {
    this.subscriptions.push(this.propertiesService.onFetching$.subscribe((isFetching: boolean) => {
      this.isFetching = isFetching;
    }));
  }

  private subscribeToPropertiesListChanges(): void {
    this.subscriptions.push(this.propertiesService.propertiesListHasChanged$.subscribe((changedList: Property[]) => {
      this.originalList = changedList;
      this.filterService.setPriceRangeFromList(this.originalList);
      this.filteredList = this.originalList;
    }));
  }

  private subscribeToFilterChanges(): void {
    this.subscriptions.push(this.filterService.onFilterPropertiesList$.pipe(
      switchMap((propertiesFilterCriteria: PropertiesFilter) => this.filterService.filterList(this.originalList, propertiesFilterCriteria)),
      catchError((error: Error) => this.handleError(error))
    ).subscribe((filteredList: Property[]) => {
      this.handleFilteredListChanges(filteredList);
    }));
  }

  private subscribeToSortChanges(): void {
    this.subscriptions.push(this.sortService.triggerSort$.pipe(
      switchMap((sortDescriptor: PropertiesSortDescriptor) => this.sortService.sortList(this.filteredList, sortDescriptor)),
      catchError((error: Error) => this.handleError(error))
    ).subscribe((sortedList: Property[]) => {
      this.handleSortListChanges(sortedList);
    }));
  }

  private subscribeToPaginationChanges(): void {
    this.subscriptions.push(this.paginationService.onPaginationChanged$.subscribe(() => {
      this.handlePaginationChanges();
    }));
  }

  // List Methods
  private initializeLists(): void {
    this.route.data.subscribe((data: Data) => {
      this.originalList = data['propertiesData'];
      this.filterService.setPriceRangeFromList(this.originalList);
      this.filteredList = this.originalList;
    });
  }

  private handlePaginationChanges(): void {
    this.paginatedList = this.paginationService.setPaginationList(this.filteredList);
    this.updateMapMarkers();
  }

  private handleSortListChanges(sortedList: Property[]): void {
    this.paginationService.onReset$.next();
    this.paginatedList = this.paginationService.setPaginationList(sortedList);
    this.updateMapMarkers();
  }

  private handleFilteredListChanges(filteredList: Property[]): void { 
    this.filteredList = filteredList;
    this.paginatedList = this.paginationService.setPaginationList(filteredList);
    this.updateMapMarkers();
    this.sortService.onReset$.next();
    this.paginationService.onReset$.next();
  }

  // Map Methods
  private updateMap(): void {
    this.mapService.updateMapCenter(this.filteredList);
    this.mapService.placeAllMarkers(this.paginatedList);
  }

  private updateMapMarkers(): void {
    this.mapService.removeAllMarkers();
    this.mapService.placeAllMarkers(this.paginatedList);
  }

  // Error Handling
  private handleError(error: any): Observable<any> {
    console.log(error);
    return of([]);
  }

  onHandleError(): void {
    this.errorMessage = null;
  }

  // Unsubscribe
  private unsubscribeAll(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}