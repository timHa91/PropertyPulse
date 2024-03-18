import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-properties-category-filter',
    templateUrl: './properties-category-filter.component.html',
    styleUrls: ['./properties-category-filter.component.css']
})
export class PropertiesCategoryFilterComponent implements OnInit{

  categoryForm!: FormGroup; 

  ngOnInit(): void {
      this.categoryForm = new FormGroup({
        'rent': new FormControl(true),
        'sale': new FormControl(true),
        'sold': new FormControl(true)
      })
  }
}