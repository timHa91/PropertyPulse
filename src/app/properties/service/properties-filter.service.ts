import { Observable, Subject, from, of, toArray, filter, switchMap, BehaviorSubject} from "rxjs";
import { Property } from "../../shared/model/property.model";
import { PropertiesFilter } from "../model/properties-filter.model";
import { PropertiesFilterPriceRange } from "../model/properties-filter-price-range.model";
import { Injectable } from "@angular/core";
import { MapboxService } from "../../mapbox/mapbox.service";
import { Category } from "../../shared/model/category.enum";

@Injectable({providedIn: 'root'})
export class PropertiesFilterService {
    onFilterList$ = new Subject<PropertiesFilter>();
    setPriceRange$ = new BehaviorSubject<PropertiesFilterPriceRange>({minPrice: 0, maxPrice: 0});
    filterHasLocation$ = new Subject<{hasValue: boolean, locationValue: string}>

    constructor(private mapService: MapboxService) {}
    
    filterList(originalList: Property[], searchCriteria: PropertiesFilter): Observable<Property[]> {
        let filteredList = [... originalList];
        filteredList = this.applySynchronousFilters(filteredList, searchCriteria);

        // Handle the radius search criteria asynchronously
        if (searchCriteria.location && searchCriteria.radius) {
            return this.applyAsynchronousFilters(filteredList, searchCriteria);
        }   
        // If no asynchronous filters are applied, return an Observable of the filtered list
        return of(filteredList);
    }
    

    private applySynchronousFilters(originalList: Property[], searchCriteria: PropertiesFilter): Property[] {
        let filteredList = originalList;
    
        if (searchCriteria.category !== undefined) {
            filteredList = filteredList.filter(item => this.isItemInCategory(item, searchCriteria.category as Category[]));
        }
    
        if (searchCriteria.maxPrice !== undefined) {
            filteredList = filteredList.filter(item => this.isItemBelowMaxPrice(item, searchCriteria.maxPrice as number));
        }
    
        if (searchCriteria.minPrice !== undefined) {
            filteredList = filteredList.filter(item => this.isItemOverMinPrice(item, searchCriteria.minPrice as number));
        }
    
        if (searchCriteria.location && !searchCriteria.radius) {
            this.emitFilterHasLocation(searchCriteria.location);
            filteredList = filteredList.filter(item => this.isItemInLocation(item, searchCriteria.location as string));
        }
    
        return filteredList;
    }

    private applyAsynchronousFilters(originalList: Property[], searchCriteria: PropertiesFilter): Observable<Property[]> {
        if (searchCriteria.location && searchCriteria.radius) {
            this.emitFilterHasLocation(searchCriteria.location);
            return this.mapService.getLocationCoordinates(searchCriteria.location)
                .pipe(
                    switchMap(searchLocationCords => {
                        return from(originalList).pipe(
                            filter(item => this.isItemInRadius(item, searchCriteria.radius as number, searchLocationCords)),
                            toArray()
                        );
                    })
                );
        }   
        return of(originalList)
    }

    setPriceRangeFromList(list: Property[]) {
        const calculatedPriceRange = this.calculatePriceRange(list);
        this.setPriceRange$.next(calculatedPriceRange);
    }

    private emitFilterHasLocation(location: string): void {
        this.filterHasLocation$.next({
            hasValue: true,
            locationValue: location
        });
    }
    
    private isItemInCategory(item: Property, filterCategory: Category[]): boolean {
        return filterCategory.includes(item.category);
    }

    private isItemBelowMaxPrice(item: Property, maxPrice: number): boolean {
        return item.price <= maxPrice;
    }

    private isItemOverMinPrice(item: Property, minPrice: number): boolean {
        return item.price >= minPrice;
    }

    private isItemInLocation(item: Property, location: string): boolean {
        return item.address.toLocaleLowerCase().includes(location.toLocaleLowerCase());
    }

    private isItemInRadius(item: Property, radius: number, searchLocation: [number, number]): boolean {
        const itemCoords = item.geometry.geometry.coordinates;
        const distanceInMeters = this.mapService.calculateDistance(
            searchLocation[1], 
            searchLocation[0], 
            itemCoords[1], 
            itemCoords[0]
        );
        return distanceInMeters <= radius * 1000;
    }

    private calculatePriceRange(list: Property[]): PropertiesFilterPriceRange {
        const minPrice = Math.min(...list.map(item => item.price));
        const maxPrice = Math.max(...list.map(item => item.price));
        return {'minPrice': minPrice, 'maxPrice': maxPrice};
     }  
}