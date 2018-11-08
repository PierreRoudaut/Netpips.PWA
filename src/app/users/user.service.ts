import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { map } from 'rxjs/internal/operators/map';
import { User } from '../auth/user';
import { Observable } from 'rxjs';

@Injectable()
export class UserService extends APIService {

    private readonly API_URL = this.API_BASE_URL + '/user';

    getAdministrableUsers() {
        return this.httpClient
            .get<User[]>(this.API_URL + '/administrable')
            .pipe(map(users => users.map(u => User.fromDto(u))));
    }

    getUsers() {
        return this.httpClient
            .get<User[]>(this.API_URL)
            .pipe(map(users => users.map(u => User.fromDto(u))));
    }

    createUser(user: User): Observable<User> {
        const body = JSON.stringify(user);

        return this.httpClient
            .post<User>(this.API_URL + '/create', body)
            .pipe(map(u => User.fromDto(u)));
    }

    updateUser(user: User): Observable<User> {
        const body = JSON.stringify(user);

        return this.httpClient
            .post<User>(this.API_URL + '/update', body)
            .pipe(map(u => User.fromDto(u)));
    }

    deleteUser(id: string): Observable<boolean> {
        const body = JSON.stringify(id);

        return this.httpClient
            .post<boolean>(this.API_URL + '/delete', body);
    }
}
