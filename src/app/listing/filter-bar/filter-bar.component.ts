import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListingService } from '../listing.service';
import { Status } from '../listing-status.enum';
import { Category } from 'src/app/shared/category.enum';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {
    filterForm! : FormGroup;
    filterStatus!: Status[];
    filterTypes!: Category[];
    
    constructor(private listingService: ListingService) {}

    ngOnInit(): void {
      this.initForm();
      this.filterStatus = this.listingService.getAllStatus();
      this.filterTypes = this.listingService.getAllTypes();
    }

    initForm() {
      this.filterForm = new FormGroup({
        'status': new FormControl(null),
        'type': new FormControl(null)
      })
    }
}
