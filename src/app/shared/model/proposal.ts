import { ProposalTotalDTO } from "../dto/proposal/proposal-total.dto";
import { Classifier } from "./classifier.model";
import { DocumentModel } from "./document.model";
import { ProposalCommission } from "./proposal-commission";
import { ProposalDetailVehicleItem } from "./proposal-detail-vehicle-item.dto";
import { ProposalDetailVehicle } from "./proposal-detail-vehicle.dto";
import { ProposalDetail } from "./proposal-detail.dto";
import { ProposalFollowUp } from "./proposal-follow-up.model";
import { ProposalPayment } from "./proposal-payment.model";
import { ProposalPerson } from "./proposal-person";
import { SalesOrder } from "./sales-order.model";

export class Proposal {
  public id: number;
  public proposalNumber: string;
  public num: number;
  public cod: string;
  public createDate: Date;
  public validityDate: Date;
  public salesOrder: SalesOrder;
  public documentContact: boolean;
  public documentContactName: string;
  public documentContactEmail: string;
  public documentContactPhone: string;

  public finantialContact: boolean;
  public finantialContactName: string;
  public finantialContactEmail: string;
  public finantialContactPhone: string;

  public commercialContactName: string;
  public commercialContactEmail: string;
  public commercialContactPhone: string;

  public proposalTotal: ProposalTotalDTO;
  public personList: ProposalPerson[];
  public proposalDetail: ProposalDetail;
  public proposalDetailVehicle: ProposalDetailVehicle;
  public proposalDetailVehicleItem: ProposalDetailVehicleItem[];
  public listCommission: ProposalDetailVehicleItem;
  public proposalPayment: ProposalPayment[];
  public proposalCommission: ProposalCommission[];
  public proposalFollowUp: ProposalFollowUp[];
  public documents: DocumentModel[];
  public contract: string;
  // verificar os atributos corretos daqui pra baixo
  public immediateDelivery: boolean;

  public status: string;
  public statusClassification: Classifier;
  public risk: string;
  public riskClassification: Classifier;

  public order: number;
  public verion: string;
}
