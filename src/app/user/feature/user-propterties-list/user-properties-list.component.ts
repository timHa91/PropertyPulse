import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { Property } from 'src/app/shared/model/property.model';
import { UserService } from '../../service/user.service';
import { UserPropertiesFilterService } from '../../service/user-properties-filter.service';

@Component({
  selector: 'app-user-properties-list',
  templateUrl: './user-properties-list.component.html',
  styleUrls: ['./user-properties-list.component.css']
})
export class UserPropertiesListComponent implements OnInit, OnDestroy {

  originalList: Property[] = [];
  filteredList: Property[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private filterService: UserPropertiesFilterService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeList();
    this.subscribeToUserLogOut();
    this.subscribeToChanges();
  }

  private initializeList(): void {
    this.route.data.subscribe(data => {
      this.originalList = data['propertiesData'];
      this.filteredList = this.originalList;
    });
  }

  private subscribeToUserLogOut(): void {
    const logoutSubscription = this.authService.userLoggedOut.subscribe(() => {
      this.userService.resetUserPropertiesList();
    });
    this.subscriptions.push(logoutSubscription);
  }

  private subscribeToChanges(): void {
    const listChangedSubscription = this.userService.propertiesListHasChanged$.subscribe(changedList => {
      this.filteredList = changedList;
    });

    const filterSubscription = this.filterService.onFilterUserPropertiesList$.subscribe(filterCriteria => {
      this.filteredList = this.filterService.filterList(this.originalList, filterCriteria);
    });

    this.subscriptions.push(listChangedSubscription, filterSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
