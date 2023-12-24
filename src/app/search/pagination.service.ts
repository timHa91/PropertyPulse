import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { RealEstateItem } from "../shared/real-estate-item.model";

@Injectable({providedIn: 'root'})
export class PaginationService {
    
    resetPaginationControl = new Subject<void>();
    page: number = 1;
    itemsPerPage: number = 2;

  setPaginationList(page: number, filteredList: RealEstateItem[]): RealEstateItem[] {
    this.page = page;
    let sliceStart = 0;
    let sliceEnd = 0;
    if(this.page === 1) {
        sliceStart = 0;
        sliceEnd = sliceStart + this.itemsPerPage;
    } else {
        sliceStart = (this.page - 1) * this.itemsPerPage;
        sliceEnd = sliceStart + this.itemsPerPage;
    }
    return filteredList.slice(sliceStart, sliceEnd);
  }

  getItemsPerPage() {
    return this.itemsPerPage;
  }

}