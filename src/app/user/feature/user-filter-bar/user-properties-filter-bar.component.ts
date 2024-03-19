import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserPropertiesStatus } from '../../model/user-properties-status.enum';
import { Category } from 'src/app/properties/model/category.enum';
import { UserPropertiesFilterService } from '../../service/user-properties-filter.service';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
 selector: 'app-user-properties-filter-bar',
 templateUrl: './user-properties-filter-bar.component.html',
 styleUrls: ['./user-properties-filter-bar.component.css']
})
export class UserPropertiesFilterBarComponent implements OnInit, OnDestroy {
 filterForm!: FormGroup;
 filterStatus!: UserPropertiesStatus[];
 filterTypes!: Category[];
 filterSubscription!: Subscription;
 propertiesListHasChangedSubscription!: Subscription;

 constructor(
            private userService: UserService,
            private filterService: UserPropertiesFilterService,
            ) {}

 ngOnInit(): void {
    this.initForm();
    this.subscribeToFilterChanges();
    this.subscribeToPropertiesListChanges();
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
        this.filterService.onFilterUserPropertiesList$.next(filterForm);
      });
 }

 private subscribeToPropertiesListChanges(): void {
    this.propertiesListHasChangedSubscription = this.userService.propertiesListHasChanged$.subscribe(() => {
      this.updateFilters();
    });
 }

 private updateFilters(): void {
    this.filterStatus = this.userService.getAllStatus();
    this.filterTypes = this.userService.getAllTypes();
 }

 ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
    this.propertiesListHasChangedSubscription.unsubscribe();
 }
}
