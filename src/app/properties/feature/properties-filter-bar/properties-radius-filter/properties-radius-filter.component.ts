import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-properties-radius-filter',
    templateUrl: './properties-radius-filter.component.html',
    styleUrls: ['./properties-radius-filter.component.css']
})
export class PropertiesRadiusFilterComponent implements OnInit{

    radiusForm!: FormGroup;

    ngOnInit(): void {
        this.radiusForm = new FormGroup({
            'radius': new FormControl(null)
        })
    }
}

