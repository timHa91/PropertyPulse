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
export class CreateListingComponent implements OnInit, OnDestroy {

    creationForm!: FormGroup;
    startEditSubscription!: Subscription;
    formResetSubscription!: Subscription;
    showCreationSubscription!: Subscription;
    toEditItem!: RealEstateItem;
    showForm = false;
    editMode = false;

    constructor(private listingService: ListingService,
                private mapService: MapboxService
        ) {}
    
        ngOnInit(): void {
            this.initForm();
            this.subscribeToStartEdit();
            this.subscribeToFormReset();
            this.subscribeToShowForm();
        }
    
        ngOnDestroy(): void {
            this.startEditSubscription.unsubscribe();
            this.formResetSubscription.unsubscribe();
            this.showCreationSubscription.unsubscribe();
        }

        subscribeToShowForm (): void {
            this.showCreationSubscription = this.listingService.showCreationForm.subscribe( showCreationForm => {
                this.showForm = showCreationForm;
              })
        }

        subscribeToStartEdit(): void {
            this.startEditSubscription = this.listingService.startedEditing.subscribe(itemIndex => {
                if (itemIndex !== null) {
                    this.editMode = true;
                    this.toEditItem = this.listingService.getItemByIndex(itemIndex);
                    this.setFormValues();
                }
            });
    }

    private subscribeToFormReset(): void {
        this.formResetSubscription = this.listingService.onFormReset.subscribe( () => {
             this.resetForm();
        })
    }
    
    private setFormValues(): void {
            this.creationForm.setValue({
                description: this.toEditItem.description,
                type: this.convertCategoryToString(),
                address: this.toEditItem.address,
                price: this.toEditItem.price,
                image: this.toEditItem.images
            });
            this.creationForm.markAsDirty();
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
        this.editMode = false;
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
        if (!this.creationForm.dirty || !this.creationForm.valid || this.creationForm.pristine) {
          return true;
        }
        return false;
      }
}