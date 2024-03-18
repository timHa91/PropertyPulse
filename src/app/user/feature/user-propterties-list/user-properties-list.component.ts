import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Property } from 'src/app/shared/model/property.model';
import { Subscription } from 'rxjs';
import { UserPropertiesFilterService } from '../../service/user-properties-filter.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-properties-list',
  templateUrl: './user-properties-list.component.html',
  styleUrls: ['./user-properties-list.component.css']
})
export class UserPropertiesListComponent implements OnInit, OnDestroy{

  orginalList: Property[] = [];
  filteredList: Property[] = [];
  listChangedSubscription!: Subscription;
  filterSubscription!: Subscription;
  logOutSubscription!: Subscription;
  constructor(private userService: UserService,
              private filterService: UserPropertiesFilterService,
              private authService: AuthService,
              private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.initList();
    this.subscribeToListChanged();
    this.subscribeToFilter();
    this.subscribeToUserLogOut();
  }

  private initList() {
    this.route.data.subscribe(data => {
      this.orginalList = data['propertiesData'];
      this.filteredList = this.orginalList;
    })
}

  private subscribeToUserLogOut() {
    this.logOutSubscription = this.authService.userLoggedOut.subscribe(() => {
      this.userService.resetUserList();
    });
  }

  private subscribeToListChanged() {
    this.listChangedSubscription = this.userService.propertiesListHasChanged$.subscribe(changedList => {
      this.filteredList = changedList; 
    })
  }

  private subscribeToFilter() {
    this.filterSubscription = this.filterService.onFilterList$.subscribe(filterCritera => {
      this.filteredList = this.filterService.filterList(this.orginalList, filterCritera);
    })
  }

  ngOnDestroy(): void {
    this.listChangedSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    this.logOutSubscription.unsubscribe();
  }
}
