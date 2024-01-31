import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-create-listing',
    templateUrl: './create-listing.component.html',
    styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit{
    creationForm!: FormGroup;

    ngOnInit(): void {
        this.creationForm = new FormGroup({
            'description': new FormControl(null),
            'type': new FormGroup({
                'rent': new FormControl(false),
                'sale': new FormControl(false),
                'sold': new FormControl(false)
            }),
            'adress': new FormControl(null),
            'price': new FormControl(null),
            'image': new FormControl(null)
        })
    }
}