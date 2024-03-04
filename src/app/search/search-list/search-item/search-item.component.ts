import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";

@Component({
    selector: 'app-search-item',
    templateUrl: './search-item.component.html',
    styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent {

    @Input() item!: RealEstateItem;
    @Output() triggerDetailView = new EventEmitter<RealEstateItem>();


    onDetailView() {
        this.triggerDetailView.emit(this.item);
    }

}