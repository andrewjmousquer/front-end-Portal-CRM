import { PaymentMethod } from "./payment-method.model";

export class PaymentRule {
  public id: number;
  public name: string;
  public installments: number;
  public tax: number;
  public paymentMethod: PaymentMethod;
  public active: boolean;
  public preApproved: boolean;

  // control frontend
  public label: string;
  public first: number;
}
