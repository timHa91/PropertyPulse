import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from './service/user.service';
import { ViewportService } from '../shared/service/viewport.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  showCreationForm = false;
  isSmallView = false;
  showCreationFormSubscription!: Subscription;
  viewportSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private viewportService: ViewportService
  ) {}

  ngOnInit(): void {
    this.subscribeToShowCreationForm();
    this.subscribeToSmallViewport();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  private subscribeToSmallViewport(): void {
    this.viewportSubscription = this.viewportService.isSmallView$.subscribe(isSmallView => {
      this.isSmallView = isSmallView;
    });
  }

  private subscribeToShowCreationForm(): void {
    this.showCreationFormSubscription = this.userService.showCreationForm$.subscribe(showForm => {
      this.showCreationForm = showForm;
    });
  }

  toggleShowCreationForm(): void {
    this.userService.resetForm();
    this.userService.showCreationForm$.next(!this.showCreationForm);
    this.userService.startedEditing$.next(-1);
  }

  greatestNumber(list: number[]): number {
    return Math.max(...list);
  }

  private unsubscribeAll(): void {
    if (this.showCreationFormSubscription) {
      this.showCreationFormSubscription.unsubscribe();
    }
    if (this.viewportSubscription) {
      this.viewportSubscription.unsubscribe();
    }
  }
}