import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ListingService } from '../listing.service';
import { Status } from '../listing-status.enum';
import { Category } from 'src/app/shared/category.enum';
import { FilterService } from './filter.service';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
 selector: 'app-filter-bar',
 templateUrl: './filter-bar.component.html',
 styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit, OnDestroy {
 filterForm!: FormGroup;
 filterStatus!: Status[];
 filterTypes!: Category[];
 filterSubscription!: Subscription;
 listingChangedSubscription!: Subscription;

 constructor(private listingService: ListingService,
              private filterService: FilterService,
              private formBuilder: FormBuilder) {}

 ngOnInit(): void {
    this.initForm();
    this.initFilter();
    this.subscribeToFilterChanges();
    this.subscribeToListingChanges();
 }

 private initFilter() {
    this.listingService.listingHasChanged$.subscribe( changedList => {
      const allStatusesInList = this.listingService.getAllStatus();
      const allTypesInList = this.listingService.getAllTypes();
      const statusControls = allStatusesInList.map(status => new FormControl(true)); 
      const typeControls = allTypesInList.map(type => new FormControl(true)); 
  
      this.filterForm = this.formBuilder.group({
          status: this.formBuilder.array(statusControls),
          type: this.formBuilder.array(typeControls)
      });
    });
 }

 private initForm(): void {
    this.filterForm = new FormGroup({
      'status': new FormControl(null),
      'type': new FormControl(null)
    });
 }

 private subscribeToFilterChanges(): void {
    this.filterSubscription = this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(filterForm => {
        this.filterService.onFilterList$.next(filterForm);
      });
 }

 private subscribeToListingChanges(): void {
    this.listingChangedSubscription = this.listingService.listingHasChanged$.subscribe(list => {
      this.updateFilters();
    });
 }

 private updateFilters(): void {
    this.filterStatus = this.listingService.getAllStatus();
    this.filterTypes = this.listingService.getAllTypes();
 }

 ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
    this.listingChangedSubscription.unsubscribe();
 }
}
