import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Menu } from '../../shared/model/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  private menuSource = new Subject<string>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Menu[]>(`${environment.api}/protected/menu/listAll`);
  }

  onMenuStateChange(key: string) {
    this.menuSource.next(key);
  }

  reset() {
    this.resetSource.next();
  }
}
