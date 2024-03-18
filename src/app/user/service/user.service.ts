import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { Property } from "../../shared/model/property.model";
import { Category } from "../../shared/model/category.enum";
import { UserPropertiesStatus } from "../model/user-properties-status.enum";
import { DataService } from "../../shared/service/data.service";

@Injectable({ providedIn: 'root' })
export class UserService {

    propertiesListHasChanged$ = new BehaviorSubject<Property[]>([]);
    startedEditing$ = new BehaviorSubject<number>(-1);
    showCreationForm$ = new BehaviorSubject<boolean>(false);
    onFormReset$ = new Subject<void>();
    userList: Property[] = [];

    constructor(private dataService: DataService) {}

    loadData(): Observable<Property[]> {
        return this.dataService.getUserItems().pipe(
            tap(fetchedItems => {
                this.userList = fetchedItems;
                this.updatePropertiesList();
            }),
            catchError(error => {
                console.error('Error loading data:', error);
                return of([]);
            })
        );
    }

    private updatePropertiesList(): void {
        this.propertiesListHasChanged$.next(this.userList.slice());
    }

    getAllProperties(): Property[] {
        return this.userList.slice();
    }

    getAllStatus(): UserPropertiesStatus[] {
        const statusList: UserPropertiesStatus[] = [];
        this.userList.forEach(item => {
            if (item.status && !statusList.includes(item.status)) {
                statusList.push(item.status);
            }
        });
        return statusList;
    }

    getAllTypes(): Category[] {
        const typeList: Category[] = [];
        this.userList.forEach(item => {
            if (item.category && !typeList.includes(item.category)) {
                typeList.push(item.category);
            }
        });
        return typeList;
    }

    addNewProperty(newItem: Property): void {
        this.dataService.storeNewItem(newItem).subscribe({
            next: () => {
                this.userList.push(newItem);
                this.updatePropertiesList();
            },
            error: error => {
                console.error('Error adding new item:', error);
            }
        });
    }

    getItemByIndex(index: number): Property {
        return this.userList[index];
    }

    resetForm(): void {
        this.onFormReset$.next();
    }

    resetUserPropertiesList(): void {
        this.userList = [];
        this.updatePropertiesList();
    }

    updateItem(item: Property): void {
        this.dataService.updateUserItem(item).subscribe({
            next: () => {
                const index = this.userList.findIndex(listItem => listItem.id === item.id);
                if (index !== -1) {
                    this.userList[index] = item;
                    this.updatePropertiesList();
                }
            },
            error: error => {
                console.error('Error updating item:', error);
            }
        });
    }

    deleteItem(itemId: string): void {
        const index = this.userList.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.dataService.deleteUserItem(itemId).subscribe({
                next: () => {
                    this.userList.splice(index, 1);
                    this.updatePropertiesList();
                },
                error: error => {
                    console.error('Error deleting item:', error);
                }
            });
        }
    }
}
