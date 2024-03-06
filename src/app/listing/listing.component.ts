import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListingService } from './listing.service';
import { Subscription } from 'rxjs';
import { ViewportService } from '../shared/viewport.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit, OnDestroy {
  showCreationForm = false; 
  isSmallView = false;
  showCreationFormSubscription!: Subscription;
  viewportSubscription!: Subscription;
  

  constructor(private listingService: ListingService,
              private viewportService: ViewportService){}

  ngOnInit(): void {  
    this.subscribeToShowCreationForm();
    this.subscribeToViewport();
  }

  ngOnDestroy(): void {
    this.showCreationFormSubscription.unsubscribe();
    this.viewportSubscription.unsubscribe();
  }

  private subscribeToViewport() {
    this.viewportSubscription = this.viewportService.isSmallView$.subscribe((isStateMatched: boolean) => {
      this.isSmallView = isStateMatched;
    })
  }

  private subscribeToShowCreationForm() {
    this.showCreationFormSubscription = this.listingService.showCreationForm$.subscribe( (showForm: boolean) => {
      this.showCreationForm = showForm;
    })
  }
 
  toogleShowCreationForm() {
    this.listingService.resetForm();
    this.listingService.showCreationForm$.next(!this.showCreationForm)
    this.listingService.startedEditing$.next(-1);
  }
}
