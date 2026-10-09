import { User } from './user';

import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends APIService {
  private readonly API_URL = this.API_BASE_URL + '/auth';
  private jwtDecoder: JwtHelperService;
  private _user: User = null;
  private expiresAt: Date = null;

  clearTokenSession() {
    localStorage.removeItem('access_token');
  }

  constructor(injector: Injector) {
    super(injector);
    this.jwtDecoder = new JwtHelperService();
    if (!this.retrieveExistingToken()) {
      console.warn('No valid access_token was retrieved from local storage');
    } else {
      console.log('access_token was successfully retrieved from local');
    }
  }

  get user(): User {
    return this._user;
  }

  login(idToken: string): Observable<string> {
    const body = JSON.stringify(idToken);

    return this.httpClient
      .post<any>(this.API_URL + '/login', body)
      .pipe(
        tap(token => {
          const decodedToken = this.jwtDecoder.decodeToken(token);
          this.expiresAt = this.jwtDecoder.getTokenExpirationDate(token);
          this._user = User.fromToken(decodedToken);
          localStorage.setItem('access_token', token);
        }));
  }

  retrieveExistingToken(): boolean {

    const accessToken = localStorage.getItem('access_token');
    if (accessToken == null) {
      return false;
    }

    let decodedToken: any;
    try {
      decodedToken = this.jwtDecoder.decodeToken(accessToken);
    } catch (ex) {
      this.clearTokenSession();
      return false;
    }

    this._user = User.fromToken(decodedToken);
    this.expiresAt = this.jwtDecoder.getTokenExpirationDate(accessToken);
    return true;
  }

  signOut(): Promise<void> {
    this._user = null;
    this.expiresAt = null;
    this.clearTokenSession();
    // prevents Google from automatically re-selecting the account on next login
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
    return Promise.resolve();
  }

  get isLoggedIn(): boolean {
    return new Date() < this.expiresAt && this.user != null;
  }
}
