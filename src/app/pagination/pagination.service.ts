import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { RealEstateItem } from "../shared/real-estate-item.model";

@Injectable({providedIn: 'root'})
export class PaginationService {
    
    onReset$ = new Subject<void>();
    page = 1;
    itemsPerPage = 2;
    onPaginationChanged$ = new Subject<void>();

  setPaginationList(list: RealEstateItem[]): RealEstateItem[] {
    let sliceStart = 0;
    let sliceEnd = 0;
    if(this.page === 1) {
        sliceStart = 0;
        sliceEnd = sliceStart + this.itemsPerPage;
    } else {
        sliceStart = (this.page - 1) * this.itemsPerPage;
        sliceEnd = sliceStart + this.itemsPerPage;
    }
    return list.slice(sliceStart, sliceEnd);
  }
}