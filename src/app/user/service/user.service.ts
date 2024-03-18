import { Injectable } from "@angular/core";
import { Property } from "../../shared/model/property.model";
import { Category } from "../../shared/model/category.enum";
import { UserPropertiesStatus } from "../model/user-properties-status.enum";
import { BehaviorSubject, Observable, Subject, catchError, of, tap } from "rxjs";
import { DataService } from "../../shared/service/data.service";

@Injectable({providedIn: 'root'})
export class UserService {

    listingHasChanged$ = new BehaviorSubject<Property[]>([]);
    startedEditing$ = new BehaviorSubject<number>(-1);
    showCreationForm$ = new BehaviorSubject<boolean>(false);
    onFormReset$ = new Subject<void>();
    userList: Property[] = [];

    constructor(private dataService: DataService){}

    loadData(): Observable<Property[]> {
        return this.dataService.getUserItems().pipe(
            tap( fetchedItems => {
                this.userList = fetchedItems;
                this.listingHasChanged$.next(this.userList.slice());
            }),
            catchError( error => {
                console.error(error);
                return of([]);
            })
        )
    }

    getAllListings(): Property[] {
        return this.userList.slice();
    }

    getAllStatus(): UserPropertiesStatus[] {
        const statusList: UserPropertiesStatus[] = [];
        this.userList.map(item => {
            if(item.status && !statusList.includes(item.status)) {
                statusList.push(item.status)
            }
        })
        return statusList;
    }

    getAllTypes(): Category[] {
        const typeList: Category[] = [];
        this.userList.map(item => {
            if(item.category && !typeList.includes(item.category)) {
                typeList.push(item.category);
            }
        })
        return typeList;
    }

    addNewListing(newItem: Property) {
        this.dataService.storeNewItem(newItem).subscribe({
            next: () => {
                this.userList.push(newItem);
                this.listingHasChanged$.next(this.userList.slice());
            },
            error: error => {
                console.error('Error storing new item:', error);  
            } 
        });
    }

    getItemByIndex(index: number): Property {
        return this.userList[index];
    }

    resetForm() {
        this.onFormReset$.next();
    }

    resetUserList() {
        this.userList = [];
    }

    updateItem(item: Property) {
        this.dataService.updateUserItem(item).subscribe({
            next: () => {
                const itemIndex = this.userList.findIndex(listItem => listItem.id === item.id);
                if (itemIndex !== -1) {
                    this.userList[itemIndex] = item;
                    this.listingHasChanged$.next(this.userList.slice());
                }
            },
            error: error => {
                console.error('Error updating item:', error);
            }
        });
    }

    deleteItem(itemId: string) {
        const itemIndex = this.userList.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.dataService.deleteUserItem(itemId).subscribe({
                next: () => {
                    this.userList.splice(itemIndex, 1);
                    this.listingHasChanged$.next(this.userList.slice());
                },
                error: error => {
                    console.error('Error deleting item:', error);
                }
            });
        }
    }
    
}