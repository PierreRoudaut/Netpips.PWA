
import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { GoogleSignInSuccess } from 'angular-google-signin';
import { environment } from 'environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, AfterViewInit {

    public clientId = environment.auth.clientId;
    readonly gSigninButtonId = 'g-signin-button';
    public errMsg: string;
    loginState: string;

    ngAfterViewInit(): void {
    }

    constructor(private authService: AuthService, private router: Router, private zone: NgZone) {
    }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn) {
            this.authService.clearTokenSession();
            this.loginState = 'AwaitingGoogleAuth';
        } else {
            this.router.navigateByUrl('');
        }
    }

    doLogin() {
        this.loginState = 'AwaitingGoogleAuth';
    }

    onGoogleSignInSuccess = (event: GoogleSignInSuccess) => {
        this.zone.run(() => {
            this.loginState = 'AwaitingBackendAuth';
            const googleUser: gapi.auth2.GoogleUser = event.googleUser;
            this.authService.clearTokenSession();
            this.authService
                .login(googleUser.getAuthResponse().id_token)
                .subscribe(() => {
                    this.loginState = 'Authenticated';
                    this.router.navigateByUrl('');
                }, errorResponse => {
                    this.loginState = 'AuthenticationError';
                    if (errorResponse.status === 403) {
                        this.errMsg = errorResponse.error.message;
                    } else {
                        this.errMsg = errorResponse.statusText;
                    }
                    this.authService.signOut();
                });
        });
    }

    onGoogleSigninFailure() {
        this.authService.clearTokenSession();
    }
}
