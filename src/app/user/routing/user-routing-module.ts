import { RouterModule, Routes } from "@angular/router";
import { UserComponent } from "../user.component";
import { NgModule } from "@angular/core";
import { userGuard } from "./user.guard";
import { userResolver } from "./user.resolver";

const routes: Routes = [
    {
    path: 'user', 
    component: UserComponent,
    canActivate: [userGuard],
    resolve: {
        propertiesData: userResolver
    }
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class UserRoutingComponent {
        
}