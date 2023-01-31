import { Channel } from "./channel-model";
import { Partner } from "./partner.model";
import { Proposal } from "./proposal";
import { Seller } from "./seller.model";

export class ProposalDetail {
  public id: number;
  public proposal: Proposal;
  public seller: Seller;
  public internSale: Seller;
  public channel: Channel;
  public partner: Partner;
}
