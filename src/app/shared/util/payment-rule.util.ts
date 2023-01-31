import { Injectable } from '@angular/core';
import { PaymentRule } from '../model/payment-rule.model';

@Injectable({ providedIn: 'root' })
export class PaymentRuleUtil {

  static buildList(data: PaymentRule[]) {

    data && data.map(rule => {
      //rule.label = rule.installments + 'X ' + (rule.tax ? 'C/ JUROS' : 'S/ JUROS');      
      rule.label = rule.name;      
      return rule;
    });
    return data;
  }
}
