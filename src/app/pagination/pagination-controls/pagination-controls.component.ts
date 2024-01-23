import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaginationService } from '../pagination.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.css']
})
export class PaginationControlsComponent implements OnInit, OnDestroy{

  @Input() listSize!: number;
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
