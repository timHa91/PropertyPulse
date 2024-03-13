import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RealEstateItem } from "./shared/real-estate-item.model";
import { Observable, catchError, map, switchMap, take, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataService {
    private apiUrl = environment.firebase.apiUrl;
    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    // Search Module
    publishItem(newItem : RealEstateItem): Observable<{name: string}> {
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

    // Userspecific Listing Module
    storeNewItem(newItem: RealEstateItem): Observable<{name: string}> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.post<{name: string}>(`${this.apiUrl}/users/${user.id}/items.json`
                , newItem);
            }),
            catchError(error => {
                console.error('API Error', error);
                return throwError(() => 'Something went wrong. Please try again later');
            })
        );
    }

    getUserItems(): Observable<RealEstateItem[]> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (user && user.token) {
                    return this.http.get<RealEstateItem[]>(`${this.apiUrl}/users/${user.id}/items.json`
);
                } else return throwError(() => 'No user is currently logged in.');
            }),
            map(items => {
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
                return throwError(() => 'Something went wrong. Please try again later');
            })
        );
    }

    deleteItem(itemId: string) {
       return this.authService.user.pipe(
        take(1),
        switchMap( user => {
            if (!user) {
                return throwError(() => 'No user is currently logged in.')
            }
            return this.http.delete(`${this.apiUrl}/users/${user.id}/items/${itemId}.json`);
        }),
        catchError(error => {
        console.error('API Error', error);
                return throwError(() => 'Something went wrong. Please try again later');
        })
       );
    }
}