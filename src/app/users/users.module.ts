import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';
import { DevextremeModule } from '../devextreme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersPageComponent } from './users-page/users-page.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MaterialModule } from '../material.module';

@NgModule({
    declarations: [
        UsersPageComponent,
        UsersListComponent
    ],
    imports: [
        DevextremeModule,
        MaterialModule,
        CommonModule,
        FormsModule, ReactiveFormsModule
    ],
    providers: [
        UserService
    ],
    entryComponents: [
    ]
})
export class UsersModule { }
