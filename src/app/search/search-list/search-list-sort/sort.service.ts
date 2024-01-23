import { Injectable } from "@angular/core";
import { Observable, Subject, map, of } from "rxjs";
import { SortDescriptor, SortDirection } from "./sort-descriptor.model";
import { RealEstateItem } from "../../../shared/real-estate-item.model";
import { MapboxService } from "src/app/map/map.service";

@Injectable({providedIn: 'root'})
export class SortService {
    resetSort = new Subject<void>();
    triggerSort$ = new Subject<SortDescriptor>();
    triggerReset$ = new Subject<void>();

    constructor (private mapService: MapboxService) {}

    sortList(list: RealEstateItem[], sortDescriptor: SortDescriptor): Observable<RealEstateItem[]> {
        let sortedList = list;
        // Apply all synchronous sorts first
        if (sortDescriptor.category === 'price') {
            if (sortDescriptor.direction === SortDirection.Ascending) {
                sortedList = this.sortByPriceAsc(list);
            } else {
                sortedList = this.sortByPriceDesc(list);
            }
        }
        // Handle the distance sort asynchronously
        if (sortDescriptor.category === 'distance' && sortDescriptor.location) {
           return this.mapService.getLocationCoordinates(sortDescriptor.location).pipe(
            map(locationCords => {
                if (sortDescriptor.direction === SortDirection.Ascending) {
                    return this.sortByDistanceAsc(list, locationCords);
                } else {
                    return this.sortByDistanceDesc(list, locationCords);
                }
            })
           )
        }
        return of(sortedList);
    }

    private sortByPriceAsc(list: RealEstateItem[]): RealEstateItem[] {
       return list.sort((a, b) => a.price - b.price);
    }

    private sortByPriceDesc(list: RealEstateItem[]): RealEstateItem[] {
        return list.sort((a, b) => b.price - a.price);
    }

    private sortByDistanceAsc(list: RealEstateItem[], searchLocation: [number, number]): RealEstateItem[] {
        if (searchLocation) {
            return list.sort((a, b) => {
                const locationA = a.geometry.geometry.coordinates;
                const locationB = b.geometry.geometry.coordinates;
                const distanceA = this.mapService.calculateDistance(locationA[0], locationA[1], searchLocation[0], searchLocation[1])
                const distanceB = this.mapService.calculateDistance(locationB[0], locationB[1], searchLocation[0], searchLocation[1])
                return distanceA < distanceB ? -1 : 1;
            })
        }
        return list;
    }
    
    private sortByDistanceDesc(list: RealEstateItem[], searchLocation: [number, number]): RealEstateItem[] {
        return list.sort((a, b) => {
            const locationA = a.geometry.geometry.coordinates;
            const locationB = b.geometry.geometry.coordinates;
            const distanceA = this.mapService.calculateDistance(locationA[0], locationA[1], searchLocation[0], searchLocation[1])
            const distanceB = this.mapService.calculateDistance(locationB[0], locationB[1], searchLocation[0], searchLocation[1])
            return distanceA > distanceB ? -1 : 1;
        })
    }

}