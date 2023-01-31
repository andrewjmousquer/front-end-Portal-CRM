import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { AccessList } from '../../../shared/model/access-list.model';

@Injectable({ providedIn: 'root' })
export class AccessListFormService {

  accessList: AccessList;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<AccessList[]>(`${environment.api}/protected/accessList/listAll`);
  }

  getById(id: number) {
    return this.http.get<AccessList>(`${environment.api}/protected/accessList/${id}`);
  }

  search(accessList: AccessList) {
    return this.http.post<AccessList[]>(`${environment.api}/protected/accessList/search`, accessList);
  }

  save(accessList: AccessList) {
    return this.http.post<AccessList>(`${environment.api}/protected/accessList/save`, accessList);
  }

  delete(id: number) {
    return this.http.delete<AccessList>(`${environment.api}/protected/accessList/${id}`);
  }
}
