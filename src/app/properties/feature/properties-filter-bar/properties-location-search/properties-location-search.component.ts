import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-properties-location-search',
    templateUrl: './properties-location-search.component.html',
    styleUrls: ['./properties-location-search.component.css']
})
export class PropertiesLocationSearchComponent implements OnInit{

    locationForm!: FormGroup;

    ngOnInit(): void {
        this.locationForm = new FormGroup({
            'location': new FormControl(null)
        })
    }
}