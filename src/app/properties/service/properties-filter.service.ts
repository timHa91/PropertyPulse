import { Observable, Subject, from, of, toArray, filter, switchMap, BehaviorSubject} from "rxjs";
import { Property } from "../../data/property.model";
import { PropertiesFilter } from "../model/properties-filter.model";
import { PropertiesFilterPriceRange } from "../model/properties-filter-price-range.model";
import { Injectable } from "@angular/core";
import { MapboxService } from "../../mapbox/mapbox.service";
import { Category } from "../../shared/model/category.enum";

@Injectable({providedIn: 'root'})
export class PropertiesFilterService {

    onFilterPropertiesList$ = new Subject<PropertiesFilter>();
    setPriceRange$ = new BehaviorSubject<PropertiesFilterPriceRange>({minPrice: 0, maxPrice: 0});
    filterHasLocation$ = new Subject<{hasValue: boolean, locationValue: string}>

    constructor(private mapService: MapboxService) {}
    
    filterList(originalList: Property[], propertiesFilterCriteria: PropertiesFilter): Observable<Property[]> {
        let filteredList = [... originalList];
        filteredList = this.applySynchronousFilters(filteredList, propertiesFilterCriteria);

        // Handle the radius filter criteria asynchronously
        if (propertiesFilterCriteria.location && propertiesFilterCriteria.radius) {
            return this.applyAsynchronousFilters(filteredList, propertiesFilterCriteria);
        }   
        // If no asynchronous filters are applied, return an Observable of the filtered list
        return of(filteredList);
    }
    

    private applySynchronousFilters(originalList: Property[], propertiesFilterCriteria: PropertiesFilter): Property[] {
        let filteredList = originalList;
    
        if (propertiesFilterCriteria.category !== undefined) {
            filteredList = filteredList.filter(item => this.isItemInCategory(item, propertiesFilterCriteria.category as Category[]));
        }
    
        if (propertiesFilterCriteria.maxPrice !== undefined) {
            filteredList = filteredList.filter(item => this.isItemBelowMaxPrice(item, propertiesFilterCriteria.maxPrice as number));
        }
    
        if (propertiesFilterCriteria.minPrice !== undefined) {
            filteredList = filteredList.filter(item => this.isItemOverMinPrice(item, propertiesFilterCriteria.minPrice as number));
        }
    
        if (propertiesFilterCriteria.location && !propertiesFilterCriteria.radius) {
            this.emitFilterHasLocation(propertiesFilterCriteria.location);
            filteredList = filteredList.filter(item => this.isItemInLocation(item, propertiesFilterCriteria.location as string));
        }
    
        return filteredList;
    }

    private applyAsynchronousFilters(originalList: Property[], propertiesFilterCriteria: PropertiesFilter): Observable<Property[]> {
        if (propertiesFilterCriteria.location && propertiesFilterCriteria.radius) {
            this.emitFilterHasLocation(propertiesFilterCriteria.location);
            return this.mapService.getLocationCoordinates(propertiesFilterCriteria.location)
                .pipe(
                    switchMap(propertiesLocationCords => {
                        return from(originalList).pipe(
                            filter(item => this.isItemInRadius(item, propertiesFilterCriteria.radius as number, propertiesLocationCords)),
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

    private isItemInRadius(item: Property, radius: number, propertyLocation: [number, number]): boolean {
        const itemCoords = item.geometry.geometry.coordinates;
        const distanceInMeters = this.mapService.calculateDistance(
            propertyLocation[1], 
            propertyLocation[0], 
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