import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Property } from "src/app/data/property.model";

@Component({
    selector: 'app-properties-item',
    templateUrl: './properties-item.component.html',
    styleUrls: ['./properties-item.component.css']
})
export class PropertiesItemComponent {

    @Input({required: true}) property!: Property;
    @Output() triggerDetailView = new EventEmitter<Property>();

    onDetailView(): void {
        this.triggerDetailView.emit(this.property);
    }

}