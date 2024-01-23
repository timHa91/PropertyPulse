import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.css']
})
export class LocationSearchComponent implements OnInit{

    locationForm!: FormGroup;

    ngOnInit(): void {
        this.locationForm = new FormGroup({
            'location': new FormControl(null)
        })
    }
}