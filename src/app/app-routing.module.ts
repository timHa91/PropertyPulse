import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchRoutingComponent } from './search/search-routing.module';
import { ListingRoutingComponent } from './listing/listing-routing-module';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SearchRoutingComponent, ListingRoutingComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
