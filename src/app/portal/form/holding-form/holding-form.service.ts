import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Holding } from '../../../shared/model/holding.model';

@Injectable({ providedIn: 'root' })
export class HoldingFormService {

  holding: Holding;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Holding[]>(`${environment.api}/protected/holding/listAll`);
  }

  getById(id: number) {
    return this.http.get<Holding>(`${environment.api}/protected/holding/${id}`);
  }

  search(holding: Holding) {
    return this.http.post<Holding[]>(`${environment.api}/protected/holding/search`, holding);
  }

  save(holding: Holding) {
    return this.http.post<Holding>(`${environment.api}/protected/holding/save`, holding);
  }

  delete(id: number) {
    return this.http.delete<Holding>(`${environment.api}/protected/holding/${id}`);
  }
}

