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
    filterSubscribtion!: Subscription;
    sortSubscribtion!: Subscription;

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
        this.filterSubscribtion = this.filterService.onFilterList$.subscribe(searchCriteria => {
            this.filterService.filterList(this.originalList, searchCriteria)
            .subscribe((filteredList) => {
                this.filteredList = filteredList;
                this.updateMap();
                this.sortService.triggerReset.next();
            });
        });
        this.sortSubscribtion = this.sortService.triggerSort.subscribe(sortDescriptor => {
            this.filteredList = this.sortService.sortList(this.filteredList, sortDescriptor);
        })
    }   

   ngOnDestroy(): void {
       this.filterSubscribtion.unsubscribe();
       this.sortSubscribtion.unsubscribe();
   }

   private initMap() {
        this.mapService.initializeMap(this.originalList);
        this.placeAllMarkers();
   }

   private placeAllMarkers() {
        this.filteredList.forEach( item => {
            this.mapService.setMarker(item.geometry.geometry.coordinates)
        });
    }

    private updateMap() {
        this.mapService.removeAllMarkers();
        this.placeAllMarkers();
    }
}
