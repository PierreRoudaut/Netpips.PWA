import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { GoogleSignInComponent } from 'angular-google-signin';
import { MaterialModule } from '../material.module';


@NgModule({
    declarations: [
        LoginPageComponent,
        GoogleSignInComponent
    ],
    imports: [
        CommonModule,
        // LoginRoutingModule,
        MaterialModule
    ],
    providers: [
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class LoginModule { }
