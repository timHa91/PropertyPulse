import { NgModule } from "@angular/core";
import { MenuComponent } from "./menu.component";
import {MatMenuModule} from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
    declarations: [
        MenuComponent
    ],
    imports: [
        MatMenuModule,
        BrowserModule,
        MatIconModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule
    ],
    exports: [
        MenuComponent
    ]
})
export class MenuModule {

}