export enum Role {
    User = 'User',
    Admin = 'Admin',
    SuperAdmin = 'SuperAdmin'
  }

  interface IUser {
    id: string;
    givenName: string;
    familyName: string;
    email: string;
    picture: string;
    role: Role;
}

export class User implements IUser {
  givenName: string;
  familyName: string;
  email: string;
  picture: string;
  role: Role;
  id: string;
  static fromToken(decodedToken: any): User {
    const u = new User();
    u.givenName = decodedToken.given_name;
    u.familyName = decodedToken.family_name;
    u.id = decodedToken.sub;
    u.email = decodedToken.email;
    u.picture = decodedToken.picture;
    u.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return u;
  }

  static fromDto(user: IUser): User {
    const u = new User();
    Object.assign(u, user);
    return u;
  }
}
