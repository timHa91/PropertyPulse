import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListingService } from '../listing.service';
import { Status } from '../listing-status.enum';
import { Category } from 'src/app/shared/category.enum';
import { FilterService } from './filter.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {
    filterForm! : FormGroup;
    filterStatus!: Status[];
    filterTypes!: Category[];
    
    constructor(private listingService: ListingService,
                private filterService: FilterService
      ) {}

    ngOnInit(): void {
      this.initForm();
      this.filterStatus = this.listingService.getAllStatus();
      this.filterTypes = this.listingService.getAllTypes();
      this.filterForm.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(filterForm => {
            this.filterService.onFilterList$.next(filterForm);
        });
    }

    private initForm() {
      this.filterForm = new FormGroup({
        'status': new FormControl(null),
        'type': new FormControl(null)
      })
    }
} 
