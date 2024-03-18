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
            tap(fetchedItems => {
                this.propertiesList = fetchedItems;
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

    publishItem(newItem: Property) {
        this.dataService.publishProperty(newItem).subscribe({
            next: () => this.fetchData(),
            error: error => this.onError$.next(error)
        });
    }

    deleteItem(itemId: string) {
        const itemIndex = this.propertiesList.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.dataService.deleteProperty(itemId).subscribe({
                next: () => {
                    this.propertiesList.splice(itemIndex, 1);
                    this.propertiesListHasChanged$.next(this.propertiesList.slice());
                },
                error: error => console.error('Error deleting item:', error)
            });
        }
    }

    updateItem(item: Property) {
        this.dataService.updateProperty(item).subscribe({
            next: () => this.fetchData(),
            error: error => console.error('Error updating item:', error)
        });
    }
}
