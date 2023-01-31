import { Classifier } from "./classifier.model";
import { PaymentMethod } from "./payment-method.model";
import { PaymentRule } from "./payment-rule.model";
import { ProposalDetail } from "./proposal-detail.dto";

export class ProposalPayment {
  public id: number;
  public paymentAmount: number;
  public dueDate: Date;
  public installmentAmount: number;
  public installments: number;
  public interest: number;
  public paymentMethod: PaymentMethod;
  public paymentRule: PaymentRule;
  public proposalDetail: ProposalDetail;
  public payer: Classifier;
  public event: Classifier;
  public days: number;
  public preApproved: boolean;
  public antecipatedBilling: boolean;
  public position: number;


  // control frontend
  public paymentPercent: number;
  public installmentsList: PaymentRule[];

  public canEditDueDate: boolean;
  public showDueDate: boolean;
  public showPaymentPreApproved?: boolean;

  public canNotGenerateAcconuts: boolean;

  public quantityDays: number;
  public showQuantityDays: boolean;
  public carbonBilling: boolean;

}
