import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { User } from '../../../shared/model/user.model';

@Injectable({ providedIn: 'root' })
export class UserFormService {

  user: User;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${environment.api}/protected/user/listAll`);
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.api}/protected/user/${id}`);
  }

  search(user: User) {
    return this.http.post<User[]>(`${environment.api}/protected/user/search`, user);
  }

  save(user: User) {
    return this.http.post<User>(`${environment.api}/protected/user`, user);
  }

  update(user: User) {
    return this.http.put<User>(`${environment.api}/protected/user`, user);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/user/${id}`);
  }
}
