import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { RealEstateItem } from 'src/app/shared/real-estate-item.model';

@Component({
  selector: 'app-listing-list',
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.css']
})
export class ListingListComponent implements OnInit{

  listings: RealEstateItem[] = [];

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    this.listings = this.listingService.getAllListings();
  }
}
