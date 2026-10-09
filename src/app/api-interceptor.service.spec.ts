import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ApiInterceptor } from './api-interceptor.service';
import { AuthService } from './auth/auth.service';

describe('ApiInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    auth = jasmine.createSpyObj('AuthService', ['clearTokenSession']);
    localStorage.setItem('access_token', 'abc');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth }
      ]
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  it('adds the bearer token and json content type', () => {
    http.get('/x').subscribe();
    const req = controller.expectOne('/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({});
  });

  it('clears the session and redirects to login on 401', () => {
    http.get('/x').subscribe({ error: () => { } });
    controller.expectOne('/x').flush('no', { status: 401, statusText: 'Unauthorized' });
    expect(auth.clearTokenSession).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('does not redirect on other errors', () => {
    http.get('/x').subscribe({ error: () => { } });
    controller.expectOne('/x').flush('no', { status: 500, statusText: 'Server Error' });
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
