import { Observable, Subject, from, of, toArray, filter, switchMap, BehaviorSubject} from "rxjs";
import { RealEstateItem } from "../shared/real-estate-item.model";
import { SearchCriteria } from "./search-criteria.model";
import { PriceRange } from "../shared/price-range.model";
import { Injectable } from "@angular/core";
import { MapboxService } from "../map/map.service";
import { Category } from "../shared/category.enum";

@Injectable({providedIn: 'root'})
export class FilterService {
    onFilterList$ = new Subject<SearchCriteria>();
    setPriceRange$ = new BehaviorSubject<PriceRange>({minPrice: 0, maxPrice: 0});

    constructor(private mapService: MapboxService) {}
    
    filterList(originalList: RealEstateItem[], searchCriteria: SearchCriteria): Observable<RealEstateItem[]> {
        let filteredList = originalList;
        // Apply all synchronous filters first
        if (searchCriteria.category && searchCriteria.category !== undefined) {
            filteredList = filteredList.filter(item => this.isItemInCategory(item, searchCriteria.category as Category[]));
        }
        if (searchCriteria.maxPrice && searchCriteria.maxPrice !== undefined) {
            filteredList = filteredList.filter(item => this.isItemBelowMaxPrice(item, searchCriteria.maxPrice as number));
        }
        if (searchCriteria.minPrice  && searchCriteria.minPrice !== undefined) {
            filteredList = filteredList.filter(item => this.isItemOverMinPrice(item, searchCriteria.minPrice as number));
        }
        if (searchCriteria.location && 
            !searchCriteria.radius && 
            searchCriteria.location !== '' && 
            searchCriteria.location !== undefined) {
                filteredList = filteredList.filter(item => this.isItemInLocation(item, searchCriteria.location as string));
            }
        // Handle the radius search criteria asynchronously
        if (searchCriteria.location && 
            searchCriteria.radius && 
            searchCriteria.radius !== undefined &&
            searchCriteria.location !== undefined) {
                return this.getLocationCoordinates(searchCriteria.location)
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
        const distanceInMeters = this.calculateDistance(
            searchLocation[1], 
            searchLocation[0], 
            itemCoords[1], 
            itemCoords[0]
        );
        return distanceInMeters <= radius * 1000;
    }
    
    private getLocationCoordinates(location: string): Observable<[number, number]> {
       return this.mapService.forwardGeocoder(location.toLocaleLowerCase());
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
    
    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    private calculatePriceRange(list: RealEstateItem[]): PriceRange {
        const minPrice = Math.min(...list.map(item => item.price));
        const maxPrice = Math.max(...list.map(item => item.price));
        return {'minPrice': minPrice, 'maxPrice': maxPrice};
     }  
}