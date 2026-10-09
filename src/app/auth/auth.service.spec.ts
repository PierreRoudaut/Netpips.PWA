import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

function makeToken(expiresInSeconds: number): string {
  const b64 = (o: any) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return [
    b64({ alg: 'none' }),
    b64({
      given_name: 'Jane', family_name: 'Doe', sub: '1', email: 'j@d.io',
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds
    }),
    'sig'
  ].join('.');
}

describe('AuthService', () => {
  let http: HttpTestingController;

  const create = (): AuthService => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthService);
  };

  beforeEach(() => {
    localStorage.clear();
    spyOn(console, 'warn');
    spyOn(console, 'log');
  });

  afterEach(() => {
    localStorage.clear();
    delete (window as any).google;
  });

  it('is logged out without a stored token', () => {
    const service = create();
    expect(service.isLoggedIn).toBe(false);
    expect(service.user).toBeNull();
  });

  it('restores the session from a valid stored token', () => {
    localStorage.setItem('access_token', makeToken(3600));
    const service = create();
    expect(service.isLoggedIn).toBe(true);
    expect(service.user.givenName).toBe('Jane');
  });

  it('is not logged in with an expired token', () => {
    localStorage.setItem('access_token', makeToken(-60));
    expect(create().isLoggedIn).toBe(false);
  });

  it('discards a malformed stored token', () => {
    localStorage.setItem('access_token', 'garbage');
    const service = create();
    expect(service.isLoggedIn).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('login posts the id token, stores the access token and sets the user', () => {
    const service = create();
    const token = makeToken(3600);
    service.login('google-id-token').subscribe();
    const req = http.expectOne(r => r.url.endsWith('/api/auth/login'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe('"google-id-token"');
    req.flush(token);
    expect(localStorage.getItem('access_token')).toBe(token);
    expect(service.isLoggedIn).toBe(true);
    http.verify();
  });

  it('signOut clears the session and disables Google auto select', async () => {
    const disableAutoSelect = jasmine.createSpy('disableAutoSelect');
    (window as any).google = { accounts: { id: { disableAutoSelect } } };
    localStorage.setItem('access_token', makeToken(3600));
    const service = create();
    await service.signOut();
    expect(service.isLoggedIn).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(disableAutoSelect).toHaveBeenCalled();
  });

  it('signOut works when the Google script is not loaded', async () => {
    const service = create();
    await expectAsync(service.signOut()).toBeResolved();
  });
});
