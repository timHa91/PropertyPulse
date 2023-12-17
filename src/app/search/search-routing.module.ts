import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search.component";

const routes: Routes = [
    {path: 'marketplace-search', component: SearchComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class SearchRoutingComponent {
}