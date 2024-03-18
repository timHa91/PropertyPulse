import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { Subscription } from 'rxjs';
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
  

  constructor(private userService: UserService,
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
    this.showCreationFormSubscription = this.userService.showCreationForm$.subscribe( (showForm: boolean) => {
      this.showCreationForm = showForm;
    })
  }
 
  toogleShowCreationForm() {
    this.userService.resetForm();
    this.userService.showCreationForm$.next(!this.showCreationForm)
    this.userService.startedEditing$.next(-1);
  }

  greatestNumber(list: number[]) {
    let maxNumber = 0;
    for(const element of list) {
    if(element > maxNumber) maxNumber = element;
  }
  return maxNumber;
}
}
