import { Injectable } from "@angular/core";
import { Property } from "../../data/property.model";
import { Observable, Subject, of } from "rxjs";
import { DataService } from "../../data/data.service";
import { tap, catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class PropertiesService {
    propertiesListHasChanged$ = new Subject<Property[]>();
    onFetching$ = new Subject<boolean>();
    onError$ = new Subject<string>();
    propertiesList: Property[] = [];

    constructor(private dataService: DataService) {}

    fetchData(): Observable<Property[]> {
        this.onFetching$.next(true);
        return this.dataService.getAllProperties().pipe(
            tap(fetchedProperties => {
                this.propertiesList = fetchedProperties;
                this.propertiesListHasChanged$.next(this.propertiesList.slice());
                this.onFetching$.next(false);
            }),
            catchError(error => {
                this.onError$.next(error);
                return of([]);
            })
        );
    }

    getAllResults(): Property[] {
        return this.propertiesList.slice();
    }

    publishProperty(newProperty: Property) {
        this.dataService.publishProperty(newProperty).subscribe({
            next: () => this.fetchData(),
            error: error => this.onError$.next(error)
        });
    }

    deleteProperty(propertyId: string) {
        const itemIndex = this.propertiesList.findIndex(property => property.id === propertyId);
        if (itemIndex !== -1) {
            this.dataService.deleteProperty(propertyId).subscribe({
                next: () => {
                    this.propertiesList.splice(itemIndex, 1);
                    this.propertiesListHasChanged$.next(this.propertiesList.slice());
                },
                error: error => console.error('Error deleting property:', error)
            });
        }
    }

    updateProperty(property: Property) {
        this.dataService.updateProperty(property).subscribe({
            next: () => this.fetchData(),
            error: error => console.error('Error updating property:', error)
        });
    }
}
