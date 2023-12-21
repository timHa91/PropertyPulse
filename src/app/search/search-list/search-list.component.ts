import { Component, OnInit, OnDestroy, AfterViewChecked, AfterViewInit } from "@angular/core";
import { SearchService } from "../search.service";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { SearchCriteria } from "../search-criteria.model";
import { Subscription, map, of, switchMap } from "rxjs";
import { PriceRange } from "src/app/shared/price-range.model";
import { MapboxService } from "src/app/map/map.service";

@Component({
    selector: 'app-search-list',
    templateUrl: './search-list.component.html',
    styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit, AfterViewInit ,OnDestroy {

    originalList: RealEstateItem[] = [];
    filteredList: RealEstateItem[] = [];

    subscripton!: Subscription

    constructor(private searchService: SearchService,
                private mapService: MapboxService        
        ) {}

        ngOnInit(): void {
            this.originalList = this.searchService.getAllResults();
            this.filteredList = this.originalList;

            this.subscripton = this.searchService.onUpdateList.pipe(
                switchMap( searchCriteria => {
                    if (searchCriteria.location && searchCriteria.radius) {
                        return this.mapService.forwardGeocoder(searchCriteria.location.toLowerCase()).pipe(
                            map(searchLocation => {
                                this.filteredList = this.originalList.filter(item => this.doesItemMeetCriteria(item, searchCriteria, searchLocation));
                            })
                        );
                    } else {
                        this.filteredList = this.originalList.filter(item => this.doesItemMeetCriteria(item, searchCriteria));
                        return of(null);
                    }
                })
            ).subscribe(() => {
                this.mapService.removeAllMarkers();
                this.setAllMarkers();
                const newPriceRange = this.getPriceRange();
                this.searchService.onPriceRangeChanged.next(newPriceRange);
            });
        }

    ngAfterViewInit(): void {
        this.mapService.initializeMap(this.filteredList);
        this.setAllMarkers();
    }

    ngOnDestroy(): void {
        this.subscripton.unsubscribe();
    }

    private getPriceRange(): PriceRange {
       const minPrice = Math.min(...this.filteredList.map(item => item.price));
       const maxPrice = Math.max(...this.filteredList.map(item => item.price));
       return {'minPrice': minPrice, 'maxPrice': maxPrice};
    }  

    private doesItemMeetCriteria(item: RealEstateItem, criteria: SearchCriteria, searchLocation?: [number, number]): boolean {
        if (!criteria.category || criteria.category.length <= 0) return false;

        let meetsCriteria = true;

        meetsCriteria = meetsCriteria && this.filterByCategory(item, criteria.category);
        if (criteria.location && !criteria.radius) {
            meetsCriteria = meetsCriteria && this.filterByLocation(item, criteria.location)
         } else {
            if (criteria.location && criteria.radius && searchLocation) {
                meetsCriteria = meetsCriteria && this.filterByRadius(item, criteria.radius, searchLocation)
            };
         };
        if (criteria.minPrice) meetsCriteria = meetsCriteria && this.filterByMinPrice(item, criteria.minPrice);
        if (criteria.maxPrice) meetsCriteria = meetsCriteria && this.filterByMaxPrice(item, criteria.maxPrice);
        
        return meetsCriteria;
    }

    private filterByCategory(item: RealEstateItem, category: string[]): boolean {
        return category.includes(item.category);
    }

    private filterByLocation(item: RealEstateItem, location: string): boolean {
        return item.address.toLowerCase().includes(location.toLowerCase());
    }

    private filterByMinPrice(item: RealEstateItem, minPrice: number): boolean {
        return item.price >= minPrice;
    }

    private filterByMaxPrice(item: RealEstateItem, maxPrice: number): boolean {
        return item.price <= maxPrice;
    }

    private filterByRadius(item: RealEstateItem, radius: number, searchLocation: [number, number]): boolean {
        const lat1 = searchLocation[1];
        const lon1 = searchLocation[0];
        const lat2 = item.geometry.geometry.coordinates[1];
        const lon2 = item.geometry.geometry.coordinates[0];
        const radiusMeter = radius * 1000;
    
        if (radius == null) {
            return true;
        }

        const R = 6371e3; // Erdradius in Metern
        const φ1 = lat1 * Math.PI/180; // Breitengrad in Radians
        const φ2 = lat2 * Math.PI/180; // Breitengrad in Radians
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;
    
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
        const d = R * c; // in meters        
        
        return d <= radiusMeter;
    }

    private setAllMarkers() {
        this.filteredList.forEach( item => {
            this.mapService.setMarker(item.geometry.geometry.coordinates)
        });
    }
}
