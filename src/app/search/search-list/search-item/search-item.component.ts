import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";

@Component({
    selector: 'app-search-item',
    templateUrl: './search-item.component.html',
    styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit{

    @Input('item') item!: RealEstateItem;
    @Output() triggerDetailView = new EventEmitter<RealEstateItem>();

    ngOnInit(): void {
        
    }

    onDetailView() {
        this.triggerDetailView.emit(this.item);
    }

}