import { Component } from "@angular/core";

@Component({
    selector: 'app-search-list-sort',
    templateUrl: './search-list-sort.component.html',
    styleUrls: ['./search-list-sort.component.css']
})
export class SearchSortComponent {
    rotate = false;
    sortDirection: string = 'asc';

toggleSortDirection() {
    this.rotate = !this.rotate;
}

}