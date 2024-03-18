import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertiesRoutingModule } from './properties/routing/properties-routing.module';
import { UserRoutingComponent } from './user/routing/user-routing-module';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/routing/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), PropertiesRoutingModule, UserRoutingComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
