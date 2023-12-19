import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SearchService } from "../../search.service";
import { Subscription, take } from "rxjs";

@Component({
    selector: 'app-price-range-filter',
    templateUrl: './price-range-filter.component.html',
    styleUrls: ['./price-range-filter.component.css']
})
export class PriceRangeFilterComponent implements OnInit, OnDestroy{

    priceForm!: FormGroup;
    minPriceRange!: number;
    maxPriceRange!: number;

    subscription!: Subscription;

    constructor(private searchService: SearchService) {}

    ngOnInit(): void {
        this.subscription = this.searchService.onPriceRangeChanged
        .pipe(
            take(1)
        )
        .subscribe(priceRange => {
                this.minPriceRange = priceRange.minPrice;
                this.maxPriceRange = priceRange.maxPrice; 
                this.priceForm.get('minPrice')?.setValue(this.minPriceRange);
                this.priceForm.get('maxPrice')?.setValue(this.maxPriceRange); 
        });
        this.initForm();
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