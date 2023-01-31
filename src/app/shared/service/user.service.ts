import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { User } from '../../shared/model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${environment.api}/protected/user/listAll`);
  }

  getByUsername(user: User) {
    return this.http.post<User>(`${environment.api}/protected/user/getByUsername`, user);
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.api}/protected/user/${id}`);
  }

  changePassword(user: User) {
    return this.http.post<User>(`${environment.api}/protected/user/changePassword`, user);
  }

  getCurrent() {
    return this.http.get<User>(`${environment.api}/protected/user/current`);
  }
}
