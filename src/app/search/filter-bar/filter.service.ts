import { Observable, Subject, from, of, toArray, filter, switchMap, BehaviorSubject} from "rxjs";
import { RealEstateItem } from "../../shared/real-estate-item.model";
import { SearchCriteria } from "../search-criteria.model";
import { PriceRange } from "../../shared/price-range.model";
import { Injectable } from "@angular/core";
import { MapboxService } from "../../map/map.service";
import { Category } from "../../shared/category.enum";

@Injectable({providedIn: 'root'})
export class FilterService {
    onFilterList$ = new Subject<SearchCriteria>();
    setPriceRange$ = new BehaviorSubject<PriceRange>({minPrice: 0, maxPrice: 0});
    filterHasLocation$ = new Subject<{hasValue: boolean, locationValue: string}>

    constructor(private mapService: MapboxService) {}
    
    filterList(originalList: RealEstateItem[], searchCriteria: SearchCriteria): Observable<RealEstateItem[]> {
        let filteredList = [...originalList];
        // Apply all synchronous filters
        if (searchCriteria.category) {
            filteredList = filteredList.filter(item => this.isItemInCategory(item, searchCriteria.category as Category[]));
        }
        if (searchCriteria.maxPrice) {
            filteredList = filteredList.filter(item => this.isItemBelowMaxPrice(item, searchCriteria.maxPrice as number));
        }
        if (searchCriteria.minPrice) {
            filteredList = filteredList.filter(item => this.isItemOverMinPrice(item, searchCriteria.minPrice as number));
        }
        if (searchCriteria.location && !searchCriteria.radius) {
                filteredList = filteredList.filter(item => this.isItemInLocation(item, searchCriteria.location as string));
            }
        // Handle the radius search criteria asynchronously
        if (searchCriteria.location && searchCriteria.radius) {
                this.filterHasLocation$.next({
                    hasValue: true, 
                    locationValue: searchCriteria.location
                })
                return this.mapService.getLocationCoordinates(searchCriteria.location)
                    .pipe(
                        switchMap(searchLocationCords => {
                            return from(filteredList).pipe(
                                filter(item => this.isItemInRadius(item, searchCriteria.radius as number, searchLocationCords)),
                                toArray()
                            );
                        })
                    );
        }   
        // If no asynchronous filters are applied, return an Observable of the filtered list
        return of(filteredList);
    }

    setPriceRangeFromList(list: RealEstateItem[]) {
        const calculatedPriceRange = this.calculatePriceRange(list);
        this.setPriceRange$.next(calculatedPriceRange);
    }
    
    private isItemInCategory(item: RealEstateItem, filterCategory: Category[]): boolean {
        return filterCategory.includes(item.category);
    }

    private isItemBelowMaxPrice(item: RealEstateItem, maxPrice: number): boolean {
        return item.price <= maxPrice;
    }

    private isItemOverMinPrice(item: RealEstateItem, minPrice: number): boolean {
        return item.price >= minPrice;
    }

    private isItemInLocation(item: RealEstateItem, location: string): boolean {
        return item.address.toLocaleLowerCase().includes(location.toLocaleLowerCase());
    }

    private isItemInRadius(item: RealEstateItem, radius: number, searchLocation: [number, number]): boolean {
        const itemCoords = item.geometry.geometry.coordinates;
        const distanceInMeters = this.mapService.calculateDistance(
            searchLocation[1], 
            searchLocation[0], 
            itemCoords[1], 
            itemCoords[0]
        );
        return distanceInMeters <= radius * 1000;
    }

    private calculatePriceRange(list: RealEstateItem[]): PriceRange {
        const minPrice = Math.min(...list.map(item => item.price));
        const maxPrice = Math.max(...list.map(item => item.price));
        return {'minPrice': minPrice, 'maxPrice': maxPrice};
     }  
}