import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListingService } from './listing.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit, OnDestroy {
  isCreationForm = false; 
  showCreationSubscription!: Subscription;

  constructor(private listingService: ListingService){}

  ngOnInit(): void {
   this.showCreationSubscription = this.listingService.showCreationForm.subscribe( showCreationForm => {
      this.isCreationForm = showCreationForm;
    })
  }
  
  ngOnDestroy(): void {
    this.showCreationSubscription.unsubscribe();
  }
  
  toogleShowCreationForm() {
    this.listingService.showCreationForm.next(!this.isCreationForm)
  }
}
