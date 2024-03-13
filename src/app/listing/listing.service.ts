import { Injectable } from "@angular/core";
import { RealEstateItem } from "../shared/real-estate-item.model";
import { Category } from "../shared/category.enum";
import { GeoJson } from "../shared/geo.model";
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

    constructor(private dataService: DataService){
        this.loadData();
    }

    // listingResults: RealEstateItem[] = [
    //     {
    //         address: '1121 48th Place Northeast Washington, DC',
    //         description: 'New Construction - 4 BD 3 BA',
    //         image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D',
    //         price: 2500,
    //         category: Category.Rent,
    //         geometry: new GeoJson ([-76.932458, 38.905337]),
    //         status: Status.DRAFT
    //     },
    //     {
    //         address: '5324 James Place Northeast Washington, DC',
    //         description: '3 BD 2 BA Single Family Home',
    //         image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D',
    //         price: 228800,
    //         category: Category.Sold,
    //         geometry: new GeoJson ([-76.92377, 38.90098]),
    //         status: Status.PUBLISHED
    //     },
    //     {
    //         address: '3438 Croffut Place Southeast',
    //         description: '4 BD 2 BD Townhome',
    //         image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D',
    //         price: 299900,
    //         category: Category.Sale,
    //         geometry: new GeoJson ([-76.95642, 38.88696]),
    //         status: Status.PUBLISHED
    //     },
    //     {
    //         address: '539 59th Street Northeast Washington, DC',
    //         description: '3 BD 2BA SIngle Family Home',
    //         image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTF8fHxlbnwwfHx8fHw%3D',
    //         price: 300000,
    //         category: Category.Sale,
    //         geometry: new GeoJson ([-76.916156, 38.896954]),
    //         status: Status.PUBLISHED
    //     },
    //     {
    //         address: '527 45th Street Northeast Washington, DC',
    //         description: 'Townhome - 4 BD 3 BA',
    //         image: 'https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW1lcmljYW4lMjBob3VzZXN8ZW58MHx8MHx8fDA%3D',
    //         price: 125000,
    //         category: Category.Sale,
    //         geometry: new GeoJson ([-76.9380523, 38.892946]),
    //         status: Status.DRAFT
    //     }
        
    // ]
    private loadData() {
        this.dataService.getUserItems().subscribe( userItems => {
            console.log(userItems);
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
                console.log(error);  
            } 
        });
    }

    getItemByIndex(index: number) {
        return this.userList[index];
    }

    resetForm() {
        this.onFormReset$.next();
    }

    updateItem(item: RealEstateItem, index: number) {
        // this.listingResults[index] = item;
        // this.listingHasChanged$.next(this.listingResults.slice());
    }

    deleteItem(index: number) {
        // this.listingResults.splice(index, 1);
        // this.listingHasChanged$.next(this.listingResults.slice());
    }
}