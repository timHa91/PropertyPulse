import { Injectable } from "@angular/core";
import { Property } from "../../shared/model/property.model";
import { Observable, Subject, of } from "rxjs";
import { DataService } from "../../shared/service/data.service";
import { tap, catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class PropertiesService {
    searchListHasChanged$ = new Subject<Property[]>();
    onFetching$ = new Subject<boolean>();
    onError$ = new Subject<string>();
    searchList: Property[] = [];

    constructor(private dataService: DataService) {}

    fetchData(): Observable<Property[]> {
        this.onFetching$.next(true);
        return this.dataService.getItems().pipe(
            tap(fetchedItems => {
                this.searchList = fetchedItems;
                this.searchListHasChanged$.next(this.searchList.slice());
                this.onFetching$.next(false);
            }),
            catchError(error => {
                this.onError$.next(error);
                return of([]);
            })
        );
    }

    getAllResults(): Property[] {
        return this.searchList.slice();
    }

    publishItem(newItem: Property) {
        this.dataService.publishItem(newItem).subscribe({
            next: () => this.fetchData(),
            error: error => this.onError$.next(error)
        });
    }

    deleteItem(itemId: string) {
        const itemIndex = this.searchList.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.dataService.deleteItem(itemId).subscribe({
                next: () => {
                    this.searchList.splice(itemIndex, 1);
                    this.searchListHasChanged$.next(this.searchList.slice());
                },
                error: error => console.error('Error deleting item:', error)
            });
        }
    }

    updateItem(item: Property) {
        this.dataService.updateItem(item).subscribe({
            next: () => this.fetchData(),
            error: error => console.error('Error updating item:', error)
        });
    }
}
