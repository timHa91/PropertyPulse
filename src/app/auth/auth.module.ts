import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from "./auth.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "../shared/loading-spinner/loading-spinner.component";

@NgModule({
    declarations: [
        AuthComponent,
        LoadingSpinnerComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule
    ]
})
export class AuthModule {

}