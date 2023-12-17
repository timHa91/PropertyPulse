import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-radius-filter',
    templateUrl: './radius-filter.component.html',
    styleUrls: ['./radius-filter.component.css']
})
export class RadiusFilterComponent implements OnInit{

    radiusForm!: FormGroup;

    ngOnInit(): void {
        this.radiusForm = new FormGroup({
            'radius': new FormControl(null)
        })
    }
}

