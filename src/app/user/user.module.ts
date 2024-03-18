import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserPropertiesFilterBarComponent } from './feature/user-filter-bar/user-properties-filter-bar.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { UserPropertiesListComponent } from './feature/user-propterties-list/user-properties-list.component';
import { UserPropertiesListItemComponent } from './feature/user-propterties-list/user-properties-list-item/user-properties-list-item.component';
import {MatCardModule} from '@angular/material/card';
import { UserCreatePropertyComponent } from './feature/user-create-property/user-create-property.component';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';


@NgModule({
  declarations: [
    UserComponent,
    UserPropertiesFilterBarComponent,
    UserPropertiesListComponent,
    UserPropertiesListItemComponent,
    UserCreatePropertyComponent
    ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    RouterModule,
    MenuComponent
  ]
})
export class UserModule { }
