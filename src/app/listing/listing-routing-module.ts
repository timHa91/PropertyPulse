import { RouterModule, Routes } from "@angular/router";
import { ListingComponent } from "./listing.component";
import { NgModule } from "@angular/core";
import { listingGuard } from "./listing.guard";

const routes: Routes = [
    {path: 'marketplace-listing', 
    component: ListingComponent,
    canActivate: [listingGuard]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class ListingRoutingComponent {
        
}