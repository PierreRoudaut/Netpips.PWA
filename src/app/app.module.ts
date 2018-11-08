import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { MaterialModule } from './material.module';

import { SnackbarService } from './helpers/snackbar.service';
import { NotificationService } from './helpers/notification.service';
import { MatIconRegistry } from '@angular/material';

import { DownloadModule } from './downloads/download.module';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.gard';
import { ApiInterceptor } from './api-interceptor.service';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';
import { TvShowsModule } from 'app/tv-shows/tv-shows.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    LoginModule,
    DownloadModule,
    MediaModule,
    UsersModule,
    TvShowsModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    SnackbarService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }

}
