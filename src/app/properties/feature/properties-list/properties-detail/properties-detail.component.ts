import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Property } from "src/app/shared/model/property.model";

@Component({
    selector: 'app-properties-detail',
    templateUrl: './properties-detail.component.html',
    styleUrls: ['./properties-detail.component.css']
})
export class PropertiesDetailComponent {
    @Input({required: true}) item!: Property;
    @Output() triggerCloseDetailView = new EventEmitter<void>();

    onClose(): void {
        this.triggerCloseDetailView.emit();
    }
}