import { Injectable } from "@angular/core";
import { Property } from "src/app/shared/model/property.model";
import { UserPropertiesFilter } from "../model/user-properties-filter.model";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class UserPropertiesFilterService {

    onFilterList$ = new Subject<UserPropertiesFilter>(); 

    filterList(toFilterList: Property[], filterCriteria: UserPropertiesFilter) {
        let filteredList: Property[] = toFilterList;
        if (filterCriteria.status && filterCriteria.status.length > 0) {
            filteredList = filteredList.filter(item => {
                return item.status && filterCriteria.status && filterCriteria.status.includes(item.status);
            });
        } 
    
        if (filterCriteria.type && filterCriteria.type.length > 0) {
            filteredList = filteredList.filter(item => {
                return item.category && filterCriteria.type && filterCriteria.type.includes(item.category);
            });
        }
    
        return filteredList;
    }
    
}