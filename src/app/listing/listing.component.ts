import { Component, OnInit } from '@angular/core';
import { ListingService } from './listing.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  showCreationForm = false; 

  constructor(private listingService: ListingService){}

  ngOnInit(): void {
    this.listingService.showCreationForm.subscribe( showForm => {
      this.showCreationForm = showForm;
    })
  }
  
  toogleShowCreationForm() {
    this.listingService.showCreationForm.next(!this.showCreationForm)
    this.listingService.resetForm();
  }
}
