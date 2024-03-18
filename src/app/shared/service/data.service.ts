import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Property } from "../model/property.model";
import { Observable, catchError, map, switchMap, take, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataService {
    private apiUrl = environment.firebase.apiUrl;
    constructor(private http: HttpClient,
                private authService: AuthService) {
    }
  
    // Search Module
    publishItem(newItem: Property): Observable<{name: string}> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.put<{name: string}>(`${this.apiUrl}/items/${newItem.id}.json`, newItem);
            }),
            catchError(error => {
                console.error('API Error', error);
                return throwError(() => 'Something went wrong. Please try again later');
            })
        );
    }

    getItems() {
        return this.fetchItems();
    }

    private fetchItems(): Observable<Property[]> {
        return this.http.get<Property[]>(`${this.apiUrl}/items.json`)
            .pipe(map(items => {
                const itemArray: Property[] = [];
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

    deleteItem(itemId: string) {
        return this.authService.user.pipe(
            take(1),
            switchMap( user => {
                if(!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.delete(`${this.apiUrl}/items/${itemId}.json`)
            }),
            catchError( error => {
                console.error('API Error', error);
                return throwError(() => 'Something went wrong. Please try again later');
        })
        )
    }

    updateItem(toUpdateItem: Property) {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.put(`${this.apiUrl}/items/${toUpdateItem.id}.json`, toUpdateItem);
            }),
            catchError(error => {
                console.error('API Error', error);
                return throwError(() => 'Something went wrong. Please try again later.');
            })
        );
    }
    
    // Userspecific Listing Module
    storeNewItem(newItem: Property): Observable<{name: string}> {
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

    updateUserItem(toUpdateItem: Property): Observable<any> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.put(`${this.apiUrl}/users/${user.id}/items/${toUpdateItem.id}.json`, toUpdateItem);
            }),
            catchError(error => {
                console.error('API Error', error);
                return throwError(() => 'Something went wrong. Please try again later.');
            })
        );
    }
    

    getUserItems(): Observable<Property[]> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (user && user.token) {
                    return this.http.get<Property[]>(`${this.apiUrl}/users/${user.id}/items.json`
            );
                } else return throwError(() => 'No user is currently logged in.');
            }),
            map(items => {
                const itemArray: Property[] = [];
                for (const key in items) {
                    if(Object.hasOwn(items, key)) {
                        if(items[key].id) {
                            itemArray.push({...items[key]})
                        } else {
                        itemArray.push({...items[key], id: key})
                        }
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

    deleteUserItem(itemId: string) {
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