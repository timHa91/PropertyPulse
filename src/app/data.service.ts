import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RealEstateItem } from "./shared/real-estate-item.model";
import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class DataService {
    private apiUrl = environment.firebase.apiUrl;
    constructor(private http: HttpClient) {
    }

    storeItem(newItem : RealEstateItem): Observable<{name: string}> {
       return this.http.post<{name: string}>(`${this.apiUrl}/items.json`, newItem)
            .pipe(
                catchError(error => {
                    console.error('API Error', error);
                    return throwError(() => 'Something went wrong. Pleas try again later');
                })
            );
    }

    getItems() {
        return this.fetchItems();
    }

    private fetchItems(): Observable<RealEstateItem[]> {
        return this.http.get<RealEstateItem[]>(`${this.apiUrl}/items.json`)
            .pipe(map(items => {
                const itemArray: RealEstateItem[] = [];
                for (const key in items) {
                    if(Object.hasOwn(items, key)) {
                        itemArray.push({...items[key], id: key})
                    }
                }
                return itemArray;
            }),
                catchError(error => {
                    console.error('API Error', error);
                    return throwError(() => 'Something went wrong. Please try again later.');
                })
            );
    }

    // storeItems(newItems: RealEstateItem[]) {
    //     this.http.put<{name: string}[]>(`${this.apiUrl}/items.json`, newItems).subscribe((items) => {
    //         console.log(items);
    //     })
    // }

    deleteItem(id: string) {
        this.http.delete(`${this.apiUrl}/items.json`);
    }
}