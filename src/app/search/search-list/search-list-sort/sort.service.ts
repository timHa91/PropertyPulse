import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { SortDescriptor, SortDirection } from "./search-list-sort.model";
import { RealEstateItem } from "../../../shared/real-estate-item.model";

@Injectable({providedIn: 'root'})
export class SortService {
    resetSort = new Subject<void>();
    triggerSort = new Subject<SortDescriptor>();
    triggerReset = new Subject<void>();

    sortList(list: RealEstateItem[], sortDescriptor: SortDescriptor): RealEstateItem[] {
        if (sortDescriptor.category === 'price') {
            if (sortDescriptor.direction === SortDirection.Ascending) {
                return this.sortByPriceAsc(list);
            } else {
                return this.sortByPriceDesc(list);
            }
        }
        return list;
    }

    sortByPriceAsc(list: RealEstateItem[]): RealEstateItem[] {
       return list.sort((a, b) => a.price - b.price);
    }

    sortByPriceDesc(list: RealEstateItem[]): RealEstateItem[] {
        return list.sort((a, b) => b.price - a.price);
    }

}