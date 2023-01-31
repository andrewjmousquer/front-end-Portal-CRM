import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Portion } from 'src/app/shared/model/portion.model';
import { environment } from 'src/environments/environment';
import { PaymentMethod } from '../model/payment-method.model';

@Injectable({ providedIn: 'root' })
export class PortionService {

  portion: Portion;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Portion[]>(`${environment.api}/protected/portion/listAll`);
  }

  getByPaymentType(paymentType: PaymentMethod) {
    let portion = new Portion();
    portion.paymentType = paymentType;
    return this.http.post<Portion[]>(`${environment.api}/protected/portion/search`, portion);
  }
}
