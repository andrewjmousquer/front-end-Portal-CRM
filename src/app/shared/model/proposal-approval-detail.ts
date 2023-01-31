import { Brand } from "./brand.model";
import { Channel } from "./channel-model";
import { Classifier } from "./classifier.model";
import { Model } from "./model.model";
import { Partner } from "./partner.model";
import { PersonHolding } from "./person-holding.model";
import { Person } from "./person.model";
import { Proposal } from "./proposal";
import { ProposalDetailVehicle } from "./proposal-detail-vehicle";
import { Seller } from "./seller.model";
import { Vehicle } from "./vehicle.model";

export class ProposalApprovalDetail {
  public client: Person;
  public proposal: Proposal;
  public partner: Partner;
  public seller: Seller;
  public brand: Brand;
  public model: Model;
  public proposalDetailVehicle: ProposalDetailVehicle;
  public vehicle: Vehicle;
  public risk: Classifier;
  public channel: Channel;
  public holdings: PersonHolding[];
}
