import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const setup = (isLoggedIn: boolean) => {
    auth = jasmine.createSpyObj('AuthService', ['clearTokenSession', 'login', 'signOut'], { isLoggedIn });
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('waits for Google auth when logged out', () => {
    setup(false);
    expect(component.loginState).toBe('AwaitingGoogleAuth');
    expect(auth.clearTokenSession).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-google-signin')).not.toBeNull();
  });

  it('redirects home when already logged in', () => {
    setup(true);
    expect(router.navigateByUrl).toHaveBeenCalledWith('');
  });

  it('authenticates against the backend with the Google id token', () => {
    setup(false);
    auth.login.and.returnValue(of('token'));
    component.onGoogleSignInSuccess('id-token');
    expect(auth.login).toHaveBeenCalledWith('id-token');
    expect(component.loginState).toBe('Authenticated');
    expect(router.navigateByUrl).toHaveBeenCalledWith('');
  });

  it('shows the backend message on 403', () => {
    setup(false);
    auth.login.and.returnValue(throwError(() => ({ status: 403, error: { message: 'Not allowed' } })));
    component.onGoogleSignInSuccess('id-token');
    expect(component.loginState).toBe('AuthenticationError');
    expect(component.errMsg).toBe('Not allowed');
    expect(auth.signOut).toHaveBeenCalled();
  });

  it('shows the status text on other errors', () => {
    setup(false);
    auth.login.and.returnValue(throwError(() => ({ status: 500, statusText: 'Server Error' })));
    component.onGoogleSignInSuccess('id-token');
    expect(component.errMsg).toBe('Server Error');
  });

  it('clears the session on sign-in failure', () => {
    setup(false);
    auth.clearTokenSession.calls.reset();
    component.onGoogleSigninFailure();
    expect(auth.clearTokenSession).toHaveBeenCalled();
  });
});
