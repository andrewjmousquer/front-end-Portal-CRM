import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { PaymentMethod } from '../model/payment-method.model';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<PaymentMethod[]>(`${environment.api}/protected/paymentmethod`);
  }

  search(model: PaymentMethod) {
    return this.http.post<PaymentMethod[]>(`${environment.api}/protected/paymentmethod/find`, model);
  }

  getById(id: number) {
    return this.http.get<PaymentMethod>(`${environment.api}/protected/paymentmethod/${id}`);
  }

  save(model: PaymentMethod) {
    return this.http.post<PaymentMethod>(`${environment.api}/protected/paymentmethod/`, model);
  }

  update(model: PaymentMethod) {
    return this.http.put<PaymentMethod>(`${environment.api}/protected/paymentmethod`, model);
  }

  delete(id: number) {
    return this.http.delete<PaymentMethod>(`${environment.api}/protected/paymentmethod/${id}`);
  }

}
