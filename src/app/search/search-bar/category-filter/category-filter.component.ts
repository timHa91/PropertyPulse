import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-category-filter',
    templateUrl: './category-filter.component.html',
    styleUrls: ['./category-filter.component.css']
})
export class CategoryFilterComponent implements OnInit{

  categoryForm!: FormGroup; 

  ngOnInit(): void {
      this.categoryForm = new FormGroup({
        'rent': new FormControl(true),
        'sale': new FormControl(true),
        'sold': new FormControl(true)
      })
  }
}