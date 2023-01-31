import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { User } from 'src/app/shared/model/user.model';

@Injectable({ providedIn: 'root' })
export class SettingsFormService {

  constructor(private http: HttpClient) { }

  saveUserConfig(user: User) {
    return this.http.post<User>(`${environment.api}/protected/user/saveUserConfig`, user);
  }

}
