import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Property } from "src/app/shared/model/property.model";

@Component({
    selector: 'app-properties-item',
    templateUrl: './properties-item.component.html',
    styleUrls: ['./properties-item.component.css']
})
export class PropertiesItemComponent {

    @Input({required: true}) item!: Property;
    @Output() triggerDetailView = new EventEmitter<Property>();


    onDetailView() {
        this.triggerDetailView.emit(this.item);
    }

}