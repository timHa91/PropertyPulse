import { Component, OnInit, OnDestroy } from "@angular/core";
import { SearchService } from "../search.service";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { Subject, Subscription} from "rxjs";
import { MapboxService } from "src/app/map/map.service";
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
    hasLocationValue = new Subject<{hasValue: boolean, locationValue: string}>();
    isDistanceSort  = false;
    filterSubscription!: Subscription;
    sortSubscription!: Subscription;
    paginationSubscription! : Subscription;

    constructor(private searchService: SearchService,
                private mapService: MapboxService,
                private paginationService: PaginationService,
                private filterService: FilterService,
                private sortService: SortService
                ) {}

    ngOnInit(): void {
        this.originalList = this.searchService.getAllResults();
        this.filterService.setPriceRangeFromList(this.originalList);
        this.filteredList = this.originalList;
        this.initMap()
        this.filterSubscription = this.filterService.onFilterList$.subscribe(searchCriteria => {
            this.filterService.filterList(this.originalList, searchCriteria).subscribe((filteredList) => {
                this.sortService.onReset$.next();
                this.filteredList = filteredList;
                this.paginatedList = this.paginationService.setPaginationList(filteredList);
                this.updateMap();
                this.paginationService.onReset$.next();
            });
        });
        this.sortSubscription = this.sortService.triggerSort$.subscribe(sortDescriptor => {
            this.sortService.sortList(this.filteredList, sortDescriptor).subscribe(sortedList => this.filteredList = sortedList);
        })
        this.paginationSubscription = this.paginationService.onPaginationChanged$.subscribe( () => {
            this.paginatedList = this.paginationService.setPaginationList(this.filteredList);
        })
    }   

    ngOnDestroy(): void {
       this.filterSubscription.unsubscribe();
       this.sortSubscription.unsubscribe();
       this.paginationSubscription.unsubscribe();
    }

    private initMap() {
        this.mapService.initializeMap(this.filteredList);
        this.mapService.placeAllMarkers(this.filteredList);
    }

    private updateMap() {
        this.mapService.removeAllMarkers();
        this.mapService.placeAllMarkers(this.filteredList);
    }

    updatePaginatedList() {
        this.filteredList = this.paginationService.setPaginationList(this.filteredList);
    }
}
