import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { map } from "rxjs/operators";
import { PropertiesSortDescriptor, PropertiesSortDirection } from "../model/properties-sort-descriptor.model";
import { Property } from "../../shared/model/property.model";
import { MapboxService } from "src/app/mapbox/mapbox.service";

enum SortCategory {
    Price = 'price',
    Distance = 'distance'
}

@Injectable({ providedIn: 'root' })
export class PropertiesSortService {
    resetSort = new Subject<void>();
    triggerSort$ = new Subject<PropertiesSortDescriptor>();
    onReset$ = new Subject<void>();

    constructor(private mapService: MapboxService) { }

    sortList(list: Property[], sortDescriptor: PropertiesSortDescriptor): Observable<Property[]> {
        let sortedList = list;

        if (sortDescriptor.category === SortCategory.Price) {
            sortedList = this.sortByPrice(list, sortDescriptor.direction);
        } else if (sortDescriptor.category === SortCategory.Distance && sortDescriptor.location) {
            return this.sortByDistance(list, sortDescriptor.direction, sortDescriptor.location);
        }

        return of(sortedList);
    }

    private sortByPrice(list: Property[], direction: string): Property[] {
        return list.sort((a, b) => {
            return direction === PropertiesSortDirection.Ascending ? a.price - b.price : b.price - a.price;
        });
    }

    private sortByDistance(list: Property[], direction: string, location: string): Observable<Property[]> {
        return this.mapService.getLocationCoordinates(location).pipe(
            map(locationCoords => {
                return this.sortByDistanceCommon(list, locationCoords, direction === PropertiesSortDirection.Ascending);
            })
        );
    }

    private sortByDistanceCommon(list: Property[], propertyLocation: [number, number], ascending: boolean): Property[] {
        return list.sort((a, b) => {
            const distanceA = this.mapService.calculateDistance(a.geometry.geometry.coordinates[0], a.geometry.geometry.coordinates[1], propertyLocation[0], propertyLocation[1]);
            const distanceB = this.mapService.calculateDistance(b.geometry.geometry.coordinates[0], b.geometry.geometry.coordinates[1], propertyLocation[0], propertyLocation[1]);
            return ascending ? distanceA - distanceB : distanceB - distanceA;
        });
    }
}
