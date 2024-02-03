import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ListingService } from "../listing.service";
import { Status } from "../listing-status.enum";
import { Category } from "src/app/shared/category.enum";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { MapboxService } from "src/app/map/map.service";
import { Observable, Subscription } from "rxjs";
import { GeoJson } from "src/app/shared/geo.model";

@Component({
    selector: 'app-create-listing',
    templateUrl: './create-listing.component.html',
    styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit, OnDestroy{

    creationForm!: FormGroup;
    editMode = false;
    startEditSubscription!: Subscription;
    toEditItem!: RealEstateItem;

    constructor(private listingService: ListingService,
                private mapService: MapboxService
        ) {}
    
        ngOnInit(): void {
            this.initForm();
        
            this.startEditSubscription = this.listingService.startedEditing.subscribe(itemIndex => {
                if (itemIndex !== null) {
                    this.editMode = true;
                    
                    this.toEditItem = this.listingService.getItemByIndex(itemIndex);
                    this.patchFormValues();
                }
            });
        }
    
        ngOnDestroy(): void {
            this.startEditSubscription.unsubscribe();
        }
    
        private patchFormValues(): void {
            
            this.creationForm.patchValue({
                description: this.toEditItem.description,
                type: this.convertCategoryToString(),
                address: this.toEditItem.address,
                price: this.toEditItem.price,
                image: this.toEditItem.images
            });
        }

    onSafeDraft() {
        const newDescription = this.creationForm.get('description')?.value;
        const newImage = this.creationForm.get('image')?.value;
        const newAddress = this.creationForm.get('address')?.value;
        const newPrice = this.creationForm.get('price')?.value;
        const newCategory = this.convertToCategory(this.creationForm.get('type')?.value);
        const newStatus = Status.DRAFT;

        this.getCordsForCreatedItem(newAddress).subscribe(coords => {
            const listingItem: RealEstateItem = {
                description: newDescription,
                images: newImage,
                address: newAddress,
                geometry: new GeoJson(coords),
                price: newPrice,
                category: newCategory,
                status: newStatus
            }
            const newListingItem = new RealEstateItem(listingItem);
            this.listingService.addNewListing(newListingItem);
            this.resetForm();
        });
    }

    private initForm() {
        this.creationForm = new FormGroup({
            'description': new FormControl(null, Validators.required),
            'type': new FormControl(null),
            'address': new FormControl(null, Validators.required),
            'price': new FormControl(null, Validators.required),
            'image': new FormControl(null, Validators.required)
        })
    }

    getErrorMessage(controlName: string): string {
        const control = this.creationForm.get(controlName)
        if (control && control.hasError('required')) {
            return 'You must enter a value';
        }
        return '';
    }

    private convertCategoryToString() {
        let typeValue: string;
        switch (this.toEditItem.category) {
            case Category.Rent:
                typeValue = 'rent';
                break;
            case Category.Sale:
                typeValue = 'sale';
                break;
            case Category.Sold:
                typeValue = 'sold';
                break;
        }
        return typeValue;
    }

    private convertToCategory(categoryString: string): Category {
        switch (categoryString) {
            case 'rent':
                return Category.Rent;
            case 'sale':
                return Category.Sale;
            case 'sold':
                return Category.Sold;
            default:
                return Category.Rent;
        }
    }
    
    private resetForm(): void {
        this.creationForm.reset(); 
        this.clearValidationErrors(); 
    }

      private clearValidationErrors(): void {
        Object.keys(this.creationForm.controls).forEach(field => {
            const control = this.creationForm.get(field);
            if (control) {
                control.setErrors(null);
            }
        });
    }

    private getCordsForCreatedItem(location: string): Observable<[number, number]> {
       return this.mapService.getLocationCoordinates(location);
    }

    checkIfSaveEnabled() {
        if (this.creationForm.pristine || !this.creationForm.valid) {
          return true;
        }
        return false;
      }
    
     
}