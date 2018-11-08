import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from 'environments/environment';
import * as is from 'is_js';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as URI from 'urijs';
import * as _ from 'lodash-es';
import { AuthService } from './auth/auth.service';

export class RouteItem {
  path: string;
  title: string;
  icon?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  mainMenuItems: RouteItem[];
  is: any = is;

  constructor(private router: Router, private titleService: Title, public authService: AuthService) {
    this.mainMenuItems = this.getMenuItems();
  }

  ngAfterViewInit(): void {
    const requestedRoute = this.router.url.substr(1);
    if (this.availableRoutes.some(r => r.path === requestedRoute)) {
      this.router.navigateByUrl(requestedRoute);
    } else {
      this.router.navigateByUrl('downloads');
    }
  }

  get availableRoutes() {
    if (!this.authService.isLoggedIn) {
      return [];
    }
    return this.router.config
      .find(f => f.path === '').children
      .filter(x => x.data.requiredRoles.indexOf(this.authService.user.role) !== -1);
  }

  getMenuItems(): RouteItem[] {
    return this.availableRoutes.map(route => ({
      path: route.path,
      title: route.data.title,
      icon: route.data.icon
    }));
  }

  get appTitle(): string {
    return _.startCase(_.first(new URI(environment.apiEndpoint).hostname().split('.')));
  }

  navigate(item: RouteItem) {
    this.router.navigateByUrl(item.path);
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.appTitle);
  }

  signOut() {
    this.authService.signOut().then(() => this.router.navigateByUrl('/login'));
  }

  openChromeExtensionPage = () => window.open(environment.chromeExtensionUrl, '_blank');

  openPlexWeb = () => window.open(`http://plex.${document.location.host}`, '_blank');
}

