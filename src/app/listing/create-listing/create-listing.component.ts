import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ListingService } from "../listing.service";
import { Status } from "../listing-status.enum";
import { Category } from "src/app/shared/category.enum";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { MapboxService } from "src/app/mapbox/mapbox.service";
import { Observable, Subscription, throwError } from "rxjs";
import { GeoJson } from "src/app/shared/geo.model";
import { Option } from "./type-option.model";
import { SearchService } from "src/app/search/search.service";

@Component({
    selector: 'app-create-listing',
    templateUrl: './create-listing.component.html',
    styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit, OnDestroy {

    checkBoxOptions: Option[] = [
        { name: 'For Rent', checked: true, value: 'rent'},
        { name: 'For Sale', checked: false, value: 'sale'},
        { name: 'Sold', checked: false, value: 'sold'},
    ]

    creationForm!: FormGroup;
    startEditSubscription!: Subscription;
    formResetSubscription!: Subscription;
    showCreationSubscription!: Subscription;
    toEditItem!: RealEstateItem;
    editItemIndex!: number;
    showForm = false;
    editMode = false;

    constructor(private listingService: ListingService,
                private mapService: MapboxService,
                private searchService: SearchService) {}
    
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

    private subscribeToShowForm (): void {
        this.showCreationSubscription = this.listingService.showCreationForm$.subscribe( showCreationForm => {
            this.showForm = showCreationForm;
        })
    }

    private subscribeToStartEdit(): void {
        this.startEditSubscription = this.listingService.startedEditing$.subscribe(itemIndex => {
            if (itemIndex !== -1) {
                this.editMode = true;
                this.editItemIndex = itemIndex;
                this.toEditItem = this.listingService.getItemByIndex(itemIndex);
                this.setFormValues();
            }
        });
    }

    private subscribeToFormReset(): void {
        this.formResetSubscription = this.listingService.onFormReset$.subscribe( () => {
             this.resetForm();
        })
    }

    private setFormValues(): void {
        this.creationForm.setValue({
            description: this.toEditItem.description,
            type: this.convertCategoryToString(),
            address: this.toEditItem.address,
            price: this.toEditItem.price,
            image: this.toEditItem.image
        });
    }

    onSafeDraft() {
        const newDescription = this.creationForm.get('description')?.value;
        const newImage = this.creationForm.get('image')?.value;
        const newAddress = this.creationForm.get('address')?.value;
        const newPrice = this.creationForm.get('price')?.value;
        const newCategory = this.convertToCategory(this.creationForm.get('type')?.value);
        const newStatus = Status.DRAFT;
        
        const listingItem: RealEstateItem = {
            description: newDescription,    
            geometry: this.toEditItem ? this.toEditItem.geometry : new GeoJson([0, 0]),
            image: newImage,    
            address: newAddress,
            price: newPrice,
            category: newCategory,
            status: newStatus,
            id: this.toEditItem ? this.toEditItem.id : ''
        };
        
        if (this.editMode && newAddress === this.toEditItem.address) {
            this.updateListing(listingItem);
        } else {
            this.createListing(listingItem);
        }
    }
        
    private updateListing(listingItem: RealEstateItem) {
        this.listingService.updateItem(listingItem);
        this.resetForm();
    }
        
    private createListing(listingItem: RealEstateItem) {
        this.getCordsForCreatedItem(listingItem.address).subscribe(coords => {
            if (coords !== undefined) {
                listingItem.geometry = new GeoJson(coords);
            }
            this.saveListing(listingItem);
            this.resetForm();
        });
    }
        
    private saveListing(listingItem: RealEstateItem) {
        if (this.editMode) {               
            this.listingService.updateItem(listingItem);
        } else {
            this.listingService.addNewListing(listingItem);
        }
    }

    private initForm() {
        this.creationForm = new FormGroup({
            'description': new FormControl(null, Validators.required),
            'type': new FormControl(null),
            'address': new FormControl(null, Validators.required),
            'price': new FormControl(null, Validators.required),
            'image': new FormControl(null, [Validators.required, this.urlValidator])
        })
        this.creationForm.get('type')?.setValue('rent');
    }

    getErrorMessage(controlName: string): string {
        const control = this.creationForm.get(controlName)
        if (control && control.hasError('required') && control.touched) {
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

    private urlValidator(control: AbstractControl): { [key: string]: any } | null {
        const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(control.value);
        return valid ? null : { invalidUrl: { value: control.value } };
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
    
    resetForm(): void {
        this.editMode = false;
        this.creationForm.reset();
        this.creationForm.get('type')?.setValue('rent');
    }

    private getCordsForCreatedItem(location: string): Observable<[number, number]> {
       return this.mapService.getLocationCoordinates(location);
    }

    // checkIfSaveEnabled() {
    //     return !this.creationForm.valid || this.creationForm.pristine;
    // }

    isItemAdraft() {
        if(this.toEditItem) {
            return this.toEditItem.status === Status.DRAFT ? false : true;
        }
        return true;
    }

    publishItem() {
        if (this.toEditItem) {
            this.toEditItem.status = Status.PUBLISHED;
            this.listingService.updateItem(this.toEditItem);
            this.searchService.publishItem(this.toEditItem);
        }
        this.resetForm();
    }

    onDeleteItem() {
        if(this.toEditItem.id) { 
            this.listingService.deleteItem(this.toEditItem.id);
            if(this.toEditItem.status === Status.PUBLISHED) {
                this.searchService.deleteItem(this.toEditItem.id);
            }
        }
        else throwError(() => 'Cant find the ID')
        this.resetForm();
    }
}