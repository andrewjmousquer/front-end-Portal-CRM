import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentRule } from 'src/app/shared/model/payment-rule.model';
import { PaymentMethod } from '../model/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentRuleService {

  paymentrule: PaymentRule;

  constructor(private http: HttpClient) { }

  getByPaymentType(paymentMethod: PaymentMethod) {
    let paymentRule = new PaymentRule();
    paymentRule.paymentMethod = paymentMethod;
    return this.http.post<PaymentRule[]>(`${environment.api}/protected/paymentrule/find`, paymentRule);
  }
}
