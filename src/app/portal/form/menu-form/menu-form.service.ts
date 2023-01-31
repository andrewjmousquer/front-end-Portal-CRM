import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Menu } from '../../../shared/model/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuFormService {

  menu: Menu;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Menu[]>(`${environment.api}/protected/menu/listAll`);
  }

  getRoots() {
    return this.http.get<Menu[]>(`${environment.api}/protected/menu/listRoots`);
  }

  getById(id: number) {
    return this.http.get<Menu>(`${environment.api}/protected/menu/${id}`);
  }

  search(menu: Menu) {
    return this.http.post<Menu[]>(`${environment.api}/protected/menu/search`, menu);
  }

  save(menu: Menu) {
    return this.http.post<Menu>(`${environment.api}/protected/menu/save`, menu);
  }

  delete(id: number) {
    return this.http.delete<Menu>(`${environment.api}/protected/menu/${id}`);
  }
}
