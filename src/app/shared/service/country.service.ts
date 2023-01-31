import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Country } from '../../shared/model/country.model';

@Injectable({ providedIn: 'root' })
export class CountryService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Country[]>(`${environment.api}/protected/country/listAll`);
  }
}
