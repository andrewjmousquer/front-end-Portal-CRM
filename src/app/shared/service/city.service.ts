import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { City } from '../../shared/model/city.model';
import { State } from '../../shared/model/state.model';

@Injectable({ providedIn: 'root' })
export class CityService {
  constructor(private http: HttpClient) { }

  getByState(state: State) {
    return this.http.get<City[]>(`${environment.api}/protected/city/getByState/` + state.id);
  }
}
