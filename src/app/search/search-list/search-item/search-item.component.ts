import { Component, Input, OnInit } from "@angular/core";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";

@Component({
    selector: 'app-search-item',
    templateUrl: './search-item.component.html',
    styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit{

    @Input('item') item!: RealEstateItem;

    ngOnInit(): void {
        
    }

}