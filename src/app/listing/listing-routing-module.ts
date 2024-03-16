import { RouterModule, Routes } from "@angular/router";
import { ListingComponent } from "./listing.component";
import { NgModule } from "@angular/core";
import { listingGuard } from "./listing.guard";
import { listingResolver } from "./listing.resolver";

const routes: Routes = [
    {
    path: 'marketplace-listing', 
    component: ListingComponent,
    canActivate: [listingGuard],
    resolve: {
        listingData: listingResolver
    }
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class ListingRoutingComponent {
        
}