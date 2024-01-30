import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchRoutingComponent } from './search/search-routing.module';
import { ListingRoutingComponent } from './listing/listing-routing-module';

const routes: Routes = [
  {path: '', redirectTo: 'marketplace-search', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SearchRoutingComponent, ListingRoutingComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
