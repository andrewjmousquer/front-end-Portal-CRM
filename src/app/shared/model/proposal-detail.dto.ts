import { Channel } from "./channel-model";
import { Partner } from "./partner.model";
import { Proposal } from "./proposal";
import { Seller } from "./seller.model";

export class ProposalDetail {
  public id: number;
  public channel: Channel;
  public internSale: Seller;
  public partner: Partner;
  public proposal: Proposal;
  public seller: Seller;
  public purchaseOrderService?: String;
  public purchaseOrderProduct?: String;
  public purchaseOrderDocumentation?: String;

}
