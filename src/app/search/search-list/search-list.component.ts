import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { SearchService } from "../search.service";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { SearchCriteria } from "../search-criteria.model";
import { Observable, Subject, Subscription, forkJoin, map, of, switchMap } from "rxjs";
import { PriceRange } from "src/app/shared/price-range.model";
import { MapboxService } from "src/app/map/map.service";
import { PaginationService } from "../../pagination/pagination.service";
import { SortDescriptor, SortDirection } from "./search-list-sort/search-list-sort.model";

@Component({
    selector: 'app-search-list',
    templateUrl: './search-list.component.html',
    styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit, AfterViewInit ,OnDestroy {

    originalList: RealEstateItem[] = [];
    filteredList: RealEstateItem[] = [];
    paginatedList: RealEstateItem[] = [];
    filterChangesSubscription!: Subscription
    resetSort = new Subject<void>();
    hasLocationValue = new Subject<{hasValue: boolean, locationValue: string}>();
    isDistanceSort : boolean = false;

    constructor(private searchService: SearchService,
                private mapService: MapboxService,
                private paginationService: PaginationService) {}

    ngOnInit(): void {
        this.originalList = this.searchService.getAllResults();
        this.filteredList = this.originalList;
        this.paginatedList = this.paginationService.setPaginationList(this.paginationService.page, this.filteredList);
        this.filterChangesSubscription = this.subscribeToFilterChanges();
    }    

    ngAfterViewInit(): void {
        // Argument is used to center to map based on the location of all items in a List
        this.mapService.initializeMap(this.originalList);
    }

    ngOnDestroy(): void {
        this.filterChangesSubscription.unsubscribe();
    }

    private calculatePriceRange(): PriceRange {
       const minPrice = Math.min(...this.filteredList.map(item => item.price));
       const maxPrice = Math.max(...this.filteredList.map(item => item.price));
       return {'minPrice': minPrice, 'maxPrice': maxPrice};
    }  

    private isItemMatchingCriteria(
        item: RealEstateItem, 
        criteria: SearchCriteria, 
        searchLocation?: [number, number])
        : boolean 
    {
        if (!criteria.category || criteria.category.length <= 0) return false;

        let meetsCriteria = true;

        meetsCriteria = meetsCriteria && this.isItemInCategory(item, criteria.category);
        if (criteria.location && !criteria.radius && !this.isDistanceSort) {
            console.log('search');
            meetsCriteria = meetsCriteria && this.isItemInLocation(item, criteria.location)
         } else {
            if (criteria.location && criteria.radius && searchLocation) {
                meetsCriteria = meetsCriteria && this.isItemInRadius(item, criteria.radius, searchLocation)
            };
         };
        if (criteria.minPrice) meetsCriteria = meetsCriteria && this.isItemAboveMinPrice(item, criteria.minPrice);
        if (criteria.maxPrice) meetsCriteria = meetsCriteria && this.isItemBelowMaxPrice(item, criteria.maxPrice);
        
        return meetsCriteria;
    }

    private isItemInCategory(item: RealEstateItem, category: string[]): boolean {
        return category.includes(item.category);
    }

    private isItemInLocation(item: RealEstateItem, location: string): boolean {
        return item.address.toLowerCase().includes(location.toLowerCase());
    }

    private isItemAboveMinPrice(item: RealEstateItem, minPrice: number): boolean {
        return item.price >= minPrice;
    }

    private isItemBelowMaxPrice(item: RealEstateItem, maxPrice: number): boolean {
        return item.price <= maxPrice;
    }

    private isItemInRadius(item: RealEstateItem, radius: number, searchLocation: [number, number]): boolean {
        const itemCoords = item.geometry.geometry.coordinates;
        const distanceInMeters = this.calculateDistance(
            searchLocation[1], 
            searchLocation[0], 
            itemCoords[1], 
            itemCoords[0]);
    
        return distanceInMeters <= radius * 1000;
    }
    
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Radius of the earth in m
        const φ1 = this.deg2rad(lat1);
        const φ2 = this.deg2rad(lat2);
        const Δφ = this.deg2rad(lat2 - lat1);
        const Δλ = this.deg2rad(lon2 - lon1);
    
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c; // Distance in m
    }

    private getDistance(item: RealEstateItem, searchLocation: string): Observable<number> {
        return this.mapService.forwardGeocoder(searchLocation.toLowerCase())
        .pipe(
            map( searchLocationCords => {
                const itemCords = item.geometry.geometry.coordinates;
                return this.calculateDistance(itemCords[1], itemCords[0], searchLocationCords[1], searchLocationCords[0]);
            })
        );    
    }
    
    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    private placeAllMarkers() {
        this.paginatedList.forEach( item => {
            this.mapService.setMarker(item.geometry.geometry.coordinates)
        });
    }

    updatePaginationList(page: number) {
        this.paginationService.page = page;
        this.paginatedList = this.paginationService.setPaginationList(this.paginationService.page, this.filteredList);
        this.mapService.removeAllMarkers();
        this.placeAllMarkers();
        const newPriceRange = this.calculatePriceRange();
        this.searchService.onPriceRangeChanged.next(newPriceRange);
        this.resetSort.next();
    }

    private subscribeToFilterChanges() {
        return this.searchService.onUpdateList.pipe(
            switchMap(searchCriteria => this.applyFilters(searchCriteria))
        ).subscribe(() => this.updateFilteredItems());
    }
    
    private applyFilters(searchCriteria: SearchCriteria) {
        this.hasLocationValue.next({
            hasValue: !searchCriteria.location,
            locationValue: searchCriteria.location || ''
        });

        if (this.isLocationRadiusFilter(searchCriteria)) {
            return this.filterByLocationRadius(searchCriteria);
        } else {
            this.filterWithoutRadius(searchCriteria);
            return of(null);
        }
    }
    
    private isLocationRadiusFilter(searchCriteria: SearchCriteria) {
        return searchCriteria.location && searchCriteria.radius;
    }
    
    private filterByLocationRadius(searchCriteria: SearchCriteria) {
        if (searchCriteria.location) {
            return this.mapService.forwardGeocoder(searchCriteria.location.toLowerCase()).pipe(
                map(searchLocation => {
                    this.filteredList = this.originalList.filter(item =>
                        this.isItemMatchingCriteria(item, searchCriteria, searchLocation)
                    );
                })
            );
        }
        return of(null);
    }
    
    private filterWithoutRadius(searchCriteria: SearchCriteria) {
        this.filteredList = this.originalList.filter(item =>
            this.isItemMatchingCriteria(item, searchCriteria)
        );
    }
    
    private updateFilteredItems() {
        this.updatePaginationList(this.paginationService.page);
        this.isListEmptyAfterFilter();
    }
    

    private isListEmptyAfterFilter() {
        if (this.paginatedList.length < 1) {
            this.updatePaginationList(1)
            this.paginationService.resetPaginationControl.next();
        }
    }   
    
    onSort(sortValues: SortDescriptor) {
        console.log('onSort Called');
        this.isDistanceSort = false;
        if (sortValues.category === 'distance') {
            this.isDistanceSort = true;
            this.sortByDistance(sortValues);
        } else if (sortValues.category === 'price') {
            this.sortByPrice(sortValues);
        }
    }
    
    private sortByDistance(sortValues: SortDescriptor) {
        const searchLocation = sortValues.location;
        const distanceObservableArray = this.originalList.map(item => this.getDistance(item, searchLocation));
        console.log('sorts');
        
        forkJoin(distanceObservableArray).subscribe(distances => {
            this.paginatedList = this.originalList.map((item, index) => ({...item, distance: distances[index]}));
            this.paginatedList.sort((a, b) => {
                const compareResult = a["distance"] - b["distance"];
                return sortValues.direction === SortDirection.Ascending ? compareResult : -compareResult;
            });
        });
    }
    
    private sortByPrice(sortValues: SortDescriptor) {
        this.paginatedList.sort((a, b) => {
            const compareResult = a.price - b.price;
            return sortValues.direction === SortDirection.Ascending ? compareResult : -compareResult;
        });
    }
    
    get itemsPerPage() {
        return this.paginationService.getItemsPerPage();
    }
}
