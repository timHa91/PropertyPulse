import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search.component";
import { searchResolver } from "./search.resolver";

const routes: Routes = [
    {
    path: 'marketplace-search', 
    component: SearchComponent, 
    resolve: {
        searchData: searchResolver
    }
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class SearchRoutingComponent {
}