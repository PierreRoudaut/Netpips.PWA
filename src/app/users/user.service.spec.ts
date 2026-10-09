import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../auth/user';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('maps users to User instances', () => {
    let users: User[];
    service.getUsers().subscribe(u => users = u);
    http.expectOne(r => r.url.endsWith('/api/user')).flush([{ email: 'a@b.c' }]);
    expect(users[0] instanceof User).toBe(true);
    expect(users[0].email).toBe('a@b.c');
  });

  it('lists administrable users', () => {
    service.getAdministrableUsers().subscribe();
    http.expectOne(r => r.url.endsWith('/api/user/administrable')).flush([]);
  });

  it('creates, updates and deletes', () => {
    const user = User.fromDto({ id: '1', email: 'a@b.c' } as any);
    service.createUser(user).subscribe();
    const create = http.expectOne(r => r.url.endsWith('/api/user/create'));
    expect(JSON.parse(create.request.body).email).toBe('a@b.c');
    create.flush(user);

    service.updateUser(user).subscribe();
    http.expectOne(r => r.url.endsWith('/api/user/update')).flush(user);

    service.deleteUser('1').subscribe();
    const del = http.expectOne(r => r.url.endsWith('/api/user/delete'));
    expect(del.request.body).toBe('"1"');
    del.flush(true);
  });
});
