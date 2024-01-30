import { Component, Input } from '@angular/core';
import { RealEstateItem } from 'src/app/shared/real-estate-item.model';

@Component({
  selector: 'app-listing-item',
  templateUrl: './listing-item.component.html',
  styleUrls: ['./listing-item.component.css']
})
export class ListingItemComponent {
  @Input() item!: RealEstateItem;
}
