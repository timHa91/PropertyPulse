import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PropertiesComponent } from "../properties.component";
import { propertiesResolver } from "./properties.resolver";

const routes: Routes = [
  {
    path: 'properties',
    component: PropertiesComponent,
    resolve: {
      propertiesData: propertiesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class PropertiesRoutingModule {}
