import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-price-range-filter',
    templateUrl: './price-range-filter.component.html',
    styleUrls: ['./price-range-filter.component.css']
})
export class PriceRangeFilterComponent implements OnInit{

    priceForm!: FormGroup;
    minPriceRange: number = 0;
    maxPriceRange: number = 300000;

    ngOnInit(): void {
        this.priceForm = new FormGroup({
            'minPrice': new FormControl(this.minPriceRange),
            'maxPrice': new FormControl( this.maxPriceRange)
        })
    }
}