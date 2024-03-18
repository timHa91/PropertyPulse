import { Component, Input } from '@angular/core';
import { Property } from 'src/app/data/property.model';
import { UserService } from '../../../service/user.service';
import { UserPropertiesStatus } from '../../../model/user-properties-status.enum';

@Component({
  selector: 'app-user-properties-list-item',
  templateUrl: './user-properties-list-item.component.html',
  styleUrls: ['./user-properties-list-item.component.css']
})
export class UserPropertiesListItemComponent {
  @Input({required: true}) item!: Property;
  @Input({required: true}) index!: number;

  constructor(private userService: UserService){}

  getItemStatusClass(status: UserPropertiesStatus): string {
    return status === UserPropertiesStatus.DRAFT ? 'draft' : 'published';
  } 

  onEditItem(): void {
    this.userService.showCreationForm$.next(true);
    this.userService.startedEditing$.next(this.index);
  }
}
