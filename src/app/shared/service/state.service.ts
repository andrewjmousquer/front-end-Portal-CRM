import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { State } from '../../shared/model/state.model';
import { Country } from '../../shared/model/country.model';

@Injectable({ providedIn: 'root' })
export class StateService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<State[]>(`${environment.api}/protected/state/listAll`);
  }

  getByCountry(country: Country) {
    return this.http.get<State[]>(`${environment.api}/protected/state/getByCountry/` + country.id);
  }
}
