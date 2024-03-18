import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../service/user.service";
import { UserPropertiesStatus } from "../../model/user-properties-status.enum";
import { Category } from "src/app/shared/model/category.enum";
import { Property } from "src/app/data/property.model";
import { MapboxService } from "src/app/mapbox/mapbox.service";
import { Observable, Subscription, throwError } from "rxjs";
import { GeoJson } from "src/app/shared/model/geo.model";
import { Option } from "../../model/type-option.model";
import { PropertiesService } from "src/app/properties/service/properties.service";

@Component({
    selector: 'app-user-create-property',
    templateUrl: './user-create-property.component.html',
    styleUrls: ['./user-create-property.component.css']
})
export class UserCreatePropertyComponent implements OnInit, OnDestroy {

    checkBoxOptions: Option[] = [
        { name: 'For Rent', checked: true, value: 'rent'},
        { name: 'For Sale', checked: false, value: 'sale'},
        { name: 'Sold', checked: false, value: 'sold'},
    ]
    creationForm!: FormGroup;
    startEditSubscription!: Subscription;
    formResetSubscription!: Subscription;
    showCreationSubscription!: Subscription;
    toEditItem!: Property;
    editItemIndex!: number;
    showForm = false;
    editMode = false;

    constructor(private userService: UserService,
                private mapService: MapboxService,
                private propertiesService: PropertiesService) {}
    
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
        this.showCreationSubscription = this.userService.showCreationForm$.subscribe( showCreationForm => {
            this.showForm = showCreationForm;
        })
    }

    private subscribeToStartEdit(): void {
        this.startEditSubscription = this.userService.startedEditing$.subscribe(itemIndex => {
            if (itemIndex !== -1) {
                this.editMode = true;
                this.editItemIndex = itemIndex;
                this.toEditItem = this.userService.getItemByIndex(itemIndex);
                this.setFormValues();
            }
        });
    }

    private subscribeToFormReset(): void {
        this.formResetSubscription = this.userService.onFormReset$.subscribe( () => {
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

    onSafeDraft(): void {
        const newDescription = this.creationForm.get('description')?.value;
        const newImage = this.creationForm.get('image')?.value;
        const newAddress = this.creationForm.get('address')?.value;
        const newPrice = this.creationForm.get('price')?.value;
        const newCategory = this.convertToCategory(this.creationForm.get('type')?.value);
        const newStatus = this.toEditItem ? this.toEditItem.status : UserPropertiesStatus.DRAFT;

        const property: Property = {
            description: newDescription,    
            geometry: this.toEditItem ? this.toEditItem.geometry : new GeoJson([0, 0]),
            image: newImage,    
            address: newAddress,
            price: newPrice,
            category: newCategory,
            status: newStatus,
            id: this.editMode ? this.toEditItem.id : undefined
        };
        
        if (this.editMode && newAddress === this.toEditItem.address) {
            this.updateproperty(property);
            if(this.toEditItem.status === UserPropertiesStatus.PUBLISHED) {
                this.propertiesService.updateItem(property);
            }
        } else {
            this.createProperty(property);
        }
    }
        
    private updateproperty(property: Property): void {
        this.userService.updateItem(property);
        this.resetForm();
    }
        
    private createProperty(property: Property): void {
        this.getCordsForCreatedItem(property.address).subscribe(coords => {
            if (coords !== undefined) {
                property.geometry = new GeoJson(coords);
            }
            this.saveProperty(property);
            this.resetForm();
        });
    }
        
    private saveProperty(property: Property): void {
        if (this.editMode) {               
            this.userService.updateItem(property);
            if(this.toEditItem.status === UserPropertiesStatus.PUBLISHED) {
                this.propertiesService.updateItem(property);
            }
        } else {
            this.userService.addNewProperty(property);
        }
    }

    private initForm(): void {
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

    private convertCategoryToString(): string {
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

    isItemAdraft(): boolean {
        if(this.toEditItem) {
            return this.toEditItem.status === UserPropertiesStatus.DRAFT ? false : true;
        }
        return true;
    }

    publishItem(): void {
        if (this.toEditItem) {
            this.toEditItem.status = UserPropertiesStatus.PUBLISHED;
            this.userService.updateItem(this.toEditItem);
            this.propertiesService.publishItem(this.toEditItem);
        }
        this.resetForm();
    }

    onDeleteItem(): void {
        if(this.toEditItem.id) { 
            this.userService.deleteItem(this.toEditItem.id);
            if(this.toEditItem.status === UserPropertiesStatus.PUBLISHED) {
                this.propertiesService.deleteItem(this.toEditItem.id);
            }
        }
        else throwError(() => 'Cant find the ID')
        this.resetForm();
    }

    get isitemPublished(): boolean {
        if(this.toEditItem) {
            return this.toEditItem.status === UserPropertiesStatus.PUBLISHED
        }
        return false;
    }
}