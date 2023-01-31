import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Holding } from '../model/holding.model';

@Injectable({ providedIn: 'root' })
export class HoldingService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Holding[]>(`${environment.api}/protected/holding/listAll`);
  }
}
