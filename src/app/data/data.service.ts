import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, switchMap, take } from "rxjs/operators";
import { Property } from "./property.model";
import { AuthService } from "../auth/service/auth.service";
import { environment } from "src/environments/environment";
import { User } from "../auth/model/user.model";

@Injectable({ providedIn: 'root' })
export class DataService {
    private apiUrl = environment.firebase.apiUrl;

    constructor(private http: HttpClient, private authService: AuthService) {}

    // Properties Module

    publisProperty(property: Property): Observable<{name: string}> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.put<{name: string}>(`${this.apiUrl}/items/${property.id}.json`, property);
            }),
            catchError(this.handleError)
        );
    }

    getAllProperties(): Observable<Property[]> {
        return this.fetchProperties();
    }

    private fetchProperties(): Observable<Property[]> {
        return this.http.get<Property[]>(`${this.apiUrl}/items.json`)
            .pipe(
                map(properties => this.mapProperties(properties)),
                catchError(this.handleError)
            );
    }

    deleteProperty(propertyId: string): Observable<void> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.delete<void>(`${this.apiUrl}/items/${propertyId}.json`);
            }),
            catchError(this.handleError)
        );
    }

    updateProperty(toUpdateProperty: Property): Observable<void> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.put<void>(`${this.apiUrl}/items/${toUpdateProperty.id}.json`, toUpdateProperty);
            }),
            catchError(this.handleError)
        );
    }
    
    // User Module

    storeNewProperty(newProperty: Property): Observable<{name: string}> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.post<{name: string}>(`${this.apiUrl}/users/${user.id}/items.json`, newProperty);
            }),
            catchError(this.handleError)
        );
    }

    updateUserProperty(toUpdateProperty: Property): Observable<void> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.put<void>(`${this.apiUrl}/users/${user.id}/items/${toUpdateProperty.id}.json`, toUpdateProperty);
            }),
            catchError(this.handleError)
        );
    }

    getUserProperties(): Observable<Property[]> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user || !user.token) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.get<Property[]>(`${this.apiUrl}/users/${user.id}/items.json`);
            }),
            map(properties => this.mapProperties(properties)),
            catchError(this.handleError)
        );
    }

    // Delete a user's item
    deleteUserProperty(propertyId: string): Observable<void> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return throwError(() => 'No user is currently logged in.');
                }
                return this.http.delete<void>(`${this.apiUrl}/users/${user.id}/items/${propertyId}.json`);
            }),
            catchError(this.handleError)
        );
    }

    private mapProperties(properties: { [key: string]: any }): Property[] {
        const propertiesArray: Property[] = [];
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                const item = properties[key];
                const id = item.id ? item.id : key;
                propertiesArray.push({...item, id});
            }
        }
        return propertiesArray;
    }

    private handleError(error: Error): Observable<never> {
        console.error('API Error', error);
        return throwError(() => 'Something went wrong. Please try again later.');
    }
}
