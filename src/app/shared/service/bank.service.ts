import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment'
import { Bank } from '../../shared/model/bank.model'

@Injectable({ providedIn: 'root' })
export class BankService {

  bank: Bank;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Bank[]>(`${environment.api}/protected/bank`);
  }
}
