import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { PropertiesFilterService } from "../../../service/properties-filter.service";

@Component({
    selector: 'app-properties-price-range-filter',
    templateUrl: './properties-price-range-filter.component.html',
    styleUrls: ['./properties-price-range-filter.component.css']
})
export class PropertiesPriceRangeFilterComponent implements OnInit, OnDestroy {

    priceForm!: FormGroup;
    minPriceRange!: number;
    maxPriceRange!: number;

    subscription!: Subscription;

    constructor(private filterService: PropertiesFilterService) {}

    ngOnInit(): void {
        this.initForm();  
        this.subscription = this.filterService.setPriceRange$
        .subscribe(priceRange => {
                this.minPriceRange = priceRange.minPrice;
                this.maxPriceRange = priceRange.maxPrice; 
                this.priceForm.get('minPrice')?.setValue(this.minPriceRange);
                this.priceForm.get('maxPrice')?.setValue(this.maxPriceRange); 
        });
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initForm() {
        this.priceForm = new FormGroup({
            'minPrice': new FormControl(null),
            'maxPrice': new FormControl(null)
        });
    }
}