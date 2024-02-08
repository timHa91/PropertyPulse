import { Injectable } from "@angular/core";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { FilterCriteria } from "./filter-criteria.model";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class FilterService {

    onFilterList$ = new Subject<FilterCriteria>(); 

    filterList(toFilterList: RealEstateItem[], filterCriteria: FilterCriteria) {
        let filteredList: RealEstateItem[] = toFilterList;
        console.log(filterCriteria);
        
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