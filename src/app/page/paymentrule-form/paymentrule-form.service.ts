import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentRule } from 'src/app/shared/model/payment-rule.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentruleFormService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<PaymentRule[]>(`${environment.api}/protected/paymentrule`);
  }

  search(paymentrule: PaymentRule) {
    return this.http.post<PaymentRule[]>(`${environment.api}/protected/paymentrule/find`, paymentrule);
  }

  find(paymentrule: PaymentRule) {
    return this.http.post<PaymentRule[]>(`${environment.api}/protected/paymentrule/find?like=false`, paymentrule);
  }

  getById(id: number) {
    return this.http.get<PaymentRule>(`${environment.api}/protected/paymentrule/${id}`);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/paymentrule/${id}`);
  }

  save(paymentrule: PaymentRule) {
    return this.http.post<PaymentRule>(`${environment.api}/protected/paymentrule`, paymentrule);
  }

  update(paymentrule: PaymentRule) {
    return this.http.put<PaymentRule>(`${environment.api}/protected/paymentrule`, paymentrule);
  }
}
