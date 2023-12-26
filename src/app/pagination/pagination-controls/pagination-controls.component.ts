import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationService } from '../pagination.service';

@Component({
  selector: 'app-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.css']
})
export class PaginationControlsComponent implements OnInit{

  page: number = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Input() listSize!: number;
  @Input() itemsPerPage!: number;

  constructor(private paginationService: PaginationService) {}

  ngOnInit(): void {
    this.paginationService.resetPaginationControl.subscribe(() => {
      this.page = 1;
    })
  }

  previous() {
    this.page = this.page - 1;
    this.pageChange.emit(this.page)
  }

  next() {
    this.page = this.page + 1;
    this.pageChange.emit(this.page)
  }
}
