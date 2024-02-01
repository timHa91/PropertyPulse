import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ListingService } from "../listing.service";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { Status } from "../listing-status.enum";
import { Category } from "src/app/shared/category.enum";

@Component({
    selector: 'app-create-listing',
    templateUrl: './create-listing.component.html',
    styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit{
    creationForm!: FormGroup;

    constructor(private listingService: ListingService) {}
    
    ngOnInit(): void {
        this.initForm();
    }

    onSafeDraft() {
        const description = this.creationForm.get('description')?.value;
        const image = this.creationForm.get('image')?.value;
        const address = this.creationForm.get('address')?.value;
        const price = this.creationForm.get('price')?.value;
        const transformedCategory = this.transformToCategoryArray(this.creationForm.get('type')?.value);
        const status = Status.DRAFT;

        const listingItem = {
            description: description,
            images: image,
            address: address,
            price: price,
            category: transformedCategory,
            status: status
        }
        const newListingItem = new RealEstateItem(listingItem);

        this.listingService.addNewListing(newListingItem);
    }

    initForm() {
        this.creationForm = new FormGroup({
            'description': new FormControl(null, Validators.required),
            'type': new FormGroup({
                'rent': new FormControl(null, Validators.required),
                'sale': new FormControl(null, Validators.required),
                'sold': new FormControl(null, Validators.required)
            }),
            'address': new FormControl(null, Validators.required),
            'price': new FormControl(null, Validators.required),
            'image': new FormControl(null, Validators.required)
        })
    }

    private transformToCategoryArray(searchCategory: { [key: string]: boolean; }) {
        const categoryArray: Category[] = [];
           Object.entries(searchCategory).forEach(([key, value]) => {
                if (value === true) {
                    const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
                    categoryArray.push(Category[upperCaseKey as keyof typeof Category])
                }
            });
            return categoryArray;
    }

    getErrorMessage(controlName: string) {
        const control = this.creationForm.get(controlName);
        if (control?.hasError('required')) {
            return 'You must enter a value';
        }
        return '';
    }
    
}