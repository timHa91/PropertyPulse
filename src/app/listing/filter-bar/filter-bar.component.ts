import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
              private filterService: FilterService) {}

 ngOnInit(): void {
    this.initForm();
    this.subscribeToFilterChanges();
    this.subscribeToListingChanges();
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
