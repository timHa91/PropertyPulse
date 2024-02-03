import { Component, Input } from '@angular/core';
import { RealEstateItem } from 'src/app/shared/real-estate-item.model';
import { Status } from '../listing-status.enum';
import { ListingService } from '../listing.service';

@Component({
  selector: 'app-listing-item',
  templateUrl: './listing-item.component.html',
  styleUrls: ['./listing-item.component.css']
})
export class ListingItemComponent {
  @Input() item!: RealEstateItem;
  @Input() index!: number;

  constructor(private listingService: ListingService){}

  getItemStatusClass(status: Status): string {
    return status === Status.DRAFT ? 'draft' : 'published';
  } 

  onEditItem() {
    this.listingService.showCreationForm.next(true);
    this.listingService.startedEditing.next(this.index);
  }
}
