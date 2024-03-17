import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";

@Component({
    selector: 'app-search-detail',
    templateUrl: './search-detail.component.html',
    styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent {
    @Input({required: true}) item!: RealEstateItem;
    @Output() triggerCloseDetailView = new EventEmitter<void>();

    onClose() {
        this.triggerCloseDetailView.emit();
    }
}