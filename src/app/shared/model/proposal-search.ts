import { Brand } from "./brand.model";
import { Model } from "./model.model";
import { PartnerGroup } from "./partner-group.model";

export class ProposalSearch {
  public status: string[] = [];
  public partner: string[] = [];
  public proposalnum: number;
  public ordernum: string;
  public name: string;
  public executive: string[];
  public brand: Brand;
  public model: Model[];
  public partnerGroup: PartnerGroup[];
  public immediateDelivery: string;
  public dateType: string;
  public dateIni: Date;
  public dateEnd: Date;
  public valFollowup: boolean;
  public valD7: boolean;
  public valD1: boolean;
  public first: number;
}
