import { Injectable } from "@angular/core";
import { RealEstateItem } from "../shared/real-estate-item.model";
import { Category } from "../shared/category.enum";
import { Status } from "./listing-status.enum";
import { BehaviorSubject, Observable, Subject, catchError, of, tap } from "rxjs";
import { DataService } from "../data.service";

@Injectable({providedIn: 'root'})
export class ListingService {

    listingHasChanged$ = new BehaviorSubject<RealEstateItem[]>([]);
    startedEditing$ = new BehaviorSubject<number>(-1);
    showCreationForm$ = new BehaviorSubject<boolean>(false);
    onFormReset$ = new Subject<void>();
    userList: RealEstateItem[] = [];

    constructor(private dataService: DataService){}

    loadData(): Observable<RealEstateItem[]> {
        return this.dataService.getUserItems().pipe(
            tap( fetchedItems => {
                this.userList = fetchedItems;
                console.log('listing has changed');
                
                this.listingHasChanged$.next(this.userList.slice());
            }),
            catchError( error => {
                console.error(error);
                return of([]);
            })
        )
    }

    getAllListings(): RealEstateItem[] {
        return this.userList.slice();
    }

    getAllStatus(): Status[] {
        const statusList: Status[] = [];
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

    addNewListing(newItem: RealEstateItem) {
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

    getItemByIndex(index: number): RealEstateItem {
        return this.userList[index];
    }

    resetForm() {
        this.onFormReset$.next();
    }

    resetUserList() {
        this.userList = [];
    }

    updateItem(item: RealEstateItem) {
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