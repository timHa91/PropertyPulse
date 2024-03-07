import { Injectable } from "@angular/core";
import { RealEstateItem } from "../shared/real-estate-item.model";
import { Subject } from "rxjs";
import { DataService } from "../data.service";
import { MapboxService } from "../mapbox/mapbox.service";

@Injectable({providedIn: 'root'})
export class SearchService {
    searchListHasChanged = new Subject<RealEstateItem[]>();
    searchList: RealEstateItem[] = [];
    onFetching$ = new Subject<boolean>();
    onError$ = new Subject<string>();

    constructor(private dataService: DataService, private mapboxService: MapboxService) {
        this.loadData();
        // this.dataService.storeItems(this.searchResults);
    }

    // searchResults: RealEstateItem[] = [
    //     {
    //         address: '1121 48th Place Northeast Washington, DC',
    //         description: 'New Construction - 4 BD 3 BA',
    //         image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D',
    //         price: 2500,
    //         category: Category.Rent,
    //         geometry: new GeoJson([-76.932458, 38.905337])
    //     },
    //     {
    //         address: '5324 James Place Northeast Washington, DC',
    //         description: '3 BD 2 BA Single Family Home',
    //         image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D',
    //         price: 228800,
    //         category: Category.Sold,
    //         geometry: new GeoJson([-76.92377, 38.90098])
    //     },
    //     {
    //         address: '3438 Croffut Place Southeast',
    //         description: '4 BD 2 BD Townhome',
    //         image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D',
    //         price: 299900,
    //         category: Category.Sale,
    //         geometry: new GeoJson([-76.95642, 38.88696])
    //     },
    //     {
    //         address: '539 59th Street Northeast Washington, DC',
    //         description: '3 BD 2BA SIngle Family Home',
    //         image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTF8fHxlbnwwfHx8fHw%3D',
    //         price: 300000,
    //         category: Category.Sale,
    //         geometry: new GeoJson([-76.916156, 38.896954])
    //     },
    //     {
    //         address: '527 45th Street Northeast Washington, DC',
    //         description: 'Townhome - 4 BD 3 BA',
    //         image: 'https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW1lcmljYW4lMjBob3VzZXN8ZW58MHx8MHx8fDA%3D',
    //         price: 125000,
    //         category: Category.Sale,
    //         geometry: new GeoJson([-76.9380523, 38.892946])
    //     }
    // ]

    private loadData() {
    this.onFetching$.next(true);
    this.dataService.getItems().subscribe({
        next: fetchedItems => {
            this.searchList = fetchedItems;
            this.searchListHasChanged.next(this.searchList.slice());
            this.mapboxService.updateMap.next();
            this.onFetching$.next(false);
        },
        error: error => {  
            this.onError$.next(error)}
        });
}

    getAllResults() {
        return this.searchList.slice();
    }

    createNewListing(newItem: RealEstateItem) {
        this.dataService.storeItem(newItem).subscribe({
            next: () => {
                this.loadData();
            },
            error: error => {
                this.onError$.next(error);
            }
        });
    }
    

    deleteItem(index: number) {
        this.searchList.splice(index, 1);
        this.searchListHasChanged.next(this.searchList.slice());
    }
}