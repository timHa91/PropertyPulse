import { RouterModule, Routes } from "@angular/router";
import { ListingComponent } from "./listing.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {path: 'marketplace-listing', component: ListingComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class ListingRoutingComponent {
        
}