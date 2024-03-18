import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaginationService } from './pagination.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnDestroy{

  @Input({required: true}) listSize!: number;
  itemsPerPage!: number;
  page!: number;
  subscription!: Subscription;

  constructor(private paginationService: PaginationService) {}

  ngOnInit(): void {
    this.itemsPerPage = this.paginationService.itemsPerPage;
    this.page = this.paginationService.page;
    this.subscription = this.paginationService.onReset$.subscribe(() => {
      this.paginationService.page = 1;
      this.page = 1;
    })
 }

 ngOnDestroy(): void {
   this.subscription.unsubscribe();
 }

  previous() {
    this.page = this.page - 1;
    this.paginationService.page = this.paginationService.page - 1;
    this.paginationService.onPaginationChanged$.next()
  }

  next() {
    this.page = this.page + 1;
    this.paginationService.page = this.paginationService.page + 1;
    this.paginationService.onPaginationChanged$.next()
  }

  ceil(value: number): number {
    return Math.ceil(value);
  }
}
