import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'environments/environment';
import { HomeComponent } from './home.component';
import { AuthGuard } from './auth/auth.gard';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { DownloadPageComponent } from './downloads/download-page/download-page.component';
import { MediaPageComponent } from './media/media-page/media-page.component';
import { UsersPageComponent } from './users/users-page/users-page.component';
import { Role } from './auth/user';
import { TvShowsPageComponent } from './tv-shows/tv-shows-page/tv-shows-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tv-shows',
        component: TvShowsPageComponent,
        data: {
          title: 'TV Shows',
          icon: 'television',
          requiredRoles: [Role.Admin, Role.SuperAdmin, Role.User]
        }
      },
      {
        path: 'downloads',
        component: DownloadPageComponent,
        data: {
          title: 'Downloads',
          icon: 'download',
          requiredRoles: [Role.Admin, Role.SuperAdmin, Role.User]
        }
      },
      {
        path: 'media',
        component: MediaPageComponent,
        data: {
          title: 'Media',
          icon: 'folder-outline',
          requiredRoles: [Role.Admin, Role.SuperAdmin, Role.User]
        }
      },
      {
        path: 'users',
        component: UsersPageComponent,
        data: {
          title: 'Users',
          icon: 'account-multiple',
          requiredRoles: [Role.Admin, Role.SuperAdmin]
        }
      }
    ]
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production && environment.routerTracingEnabled })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
