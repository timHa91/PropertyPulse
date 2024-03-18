import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Property } from "../shared/model/property.model";

@Injectable({providedIn: 'root'})
export class PaginationService {
    
    onReset$ = new Subject<void>();
    page = 1;
    itemsPerPage = 3;
    onPaginationChanged$ = new Subject<void>();

  setPaginationList(list: Property[]): Property[] {
    if(list.length <= 1) return list;
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