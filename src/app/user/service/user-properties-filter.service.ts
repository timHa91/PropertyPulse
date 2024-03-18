import { Injectable } from "@angular/core";
import { Property } from "src/app/shared/model/property.model";
import { UserPropertiesFilter } from "../model/user-properties-filter.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserPropertiesFilterService {

    onFilterUserPropertiesList$ = new Subject<UserPropertiesFilter>();

    filterList(toFilterProperties: Property[], filterCriteria: UserPropertiesFilter): Property[] {
        let filteredProperties: Property[] = [...toFilterProperties];

        if (filterCriteria.status && filterCriteria.status.length > 0) {
            filteredProperties = this.filterByStatus(filteredProperties, filterCriteria.status);
        }

        if (filterCriteria.type && filterCriteria.type.length > 0) {
            filteredProperties = this.filterByType(filteredProperties, filterCriteria.type);
        }

        return filteredProperties;
    }

    private filterByStatus(properties: Property[], statusFilters: string[]): Property[] {
        return properties.filter(property => property.status && statusFilters.includes(property.status));
    }

    private filterByType(properties: Property[], typeFilters: string[]): Property[] {
        return properties.filter(property => property.category && typeFilters.includes(property.category));
    }
}
