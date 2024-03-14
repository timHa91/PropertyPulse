import { Injectable } from "@angular/core";
import { RealEstateItem } from "../shared/real-estate-item.model";
import { Category } from "../shared/category.enum";
import { Status } from "./listing-status.enum";
import { BehaviorSubject, Subject } from "rxjs";
import { DataService } from "../data.service";

@Injectable({providedIn: 'root'})
export class ListingService {

    listingHasChanged$ = new Subject<RealEstateItem[]>();
    startedEditing$ = new BehaviorSubject<number>(-1);
    showCreationForm$ = new BehaviorSubject<boolean>(false);
    onFormReset$ = new Subject<void>();
    userList: RealEstateItem[] = [];

    constructor(private dataService: DataService){}

  
    loadData() {
        this.dataService.getUserItems().subscribe( userItems => {
            this.userList = userItems;
            this.listingHasChanged$.next(this.userList.slice());
        })
    }

    getAllListings() {
        return this.userList.slice();
    }

    getAllStatus() {
        const statusList: Status[] = [];
        this.userList.map(item => {
            if(item.status && !statusList.includes(item.status)) {
                statusList.push(item.status)
            }
        })
        return statusList;
    }

    getAllTypes() {
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
                this.loadData();
            },
            error: error => {
                console.error('Error storing new item:', error);  
            } 
        });
    }

    getItemByIndex(index: number) {
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
                this.loadData(); 
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