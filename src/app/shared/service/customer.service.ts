import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Customer } from '../../shared/model/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Customer[]>(`${environment.api}/protected/customer/listAll`);
  }

  getById(id: number) {
    return this.http.get<Customer>(`${environment.api}/protected/customer/${id}`);
  }
}
