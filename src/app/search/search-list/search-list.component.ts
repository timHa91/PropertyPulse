import { Component, OnInit } from "@angular/core";
import { SearchService } from "../search.service";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { SearchCriteria } from "../search-criteria.model";

@Component({
    selector: 'app-search-list',
    templateUrl: './search-list.component.html',
    styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {

    orginalList: RealEstateItem[] = [];
    filteredList: RealEstateItem[] = [];

    constructor(private searchService: SearchService) {}

    ngOnInit(): void {
        this.orginalList = this.searchService.getAllResults();
        this.filteredList = this.orginalList;
        this.searchService.onUpdateList.subscribe( searchCriteria => {
            this.filterList(searchCriteria);
        });
    }

    private filterList(criteria: SearchCriteria) {
        this.filteredList = this.orginalList.filter(item => {
            let meetsCriteria = true;
    
            if (criteria.category != undefined && criteria.category.length > 0) {
                meetsCriteria = meetsCriteria && criteria.category.includes(item.category);
            }
    
            if (criteria.location != undefined) {
                meetsCriteria = meetsCriteria && item.adress.toLowerCase().includes(criteria.location.toLowerCase());
                console.log('nach location: ' + meetsCriteria);
            }
    
            if (criteria.minPrice != undefined) {
                meetsCriteria = meetsCriteria && item.price >= criteria.minPrice;
                console.log('nach minPrc: ' + meetsCriteria);
            }
    
            if (criteria.maxPrice != undefined) {
                meetsCriteria = meetsCriteria && item.price <= criteria.maxPrice;
                console.log('nach maxPr: ' + meetsCriteria);
            }            
            console.log(meetsCriteria);
            
            return meetsCriteria;     
        });
    }    
}