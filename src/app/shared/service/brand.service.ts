import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment'
import { Brand } from '../model/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandService {

  brand: Brand;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Brand[]>(`${environment.api}/protected/brand`);
  }
}
