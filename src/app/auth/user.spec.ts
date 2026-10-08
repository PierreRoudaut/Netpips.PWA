import { Role, User } from './user';

describe('User', () => {
  it('is built from decoded token claims', () => {
    const user = User.fromToken({
      given_name: 'Jane', family_name: 'Doe', sub: '42', email: 'j@d.io', picture: 'p',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': Role.Admin
    });
    expect(user.givenName).toBe('Jane');
    expect(user.familyName).toBe('Doe');
    expect(user.id).toBe('42');
    expect(user.role).toBe(Role.Admin);
  });

  it('is built from a dto', () => {
    const user = User.fromDto({ id: '1', givenName: 'A', familyName: 'B', email: 'e', picture: 'p', role: Role.User });
    expect(user instanceof User).toBe(true);
    expect(user.email).toBe('e');
  });
});
