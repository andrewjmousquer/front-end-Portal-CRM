import { Brand } from "./brand.model";
import { Classifier } from "./classifier.model";
import { Model } from "./model.model";
import { Proposal } from "./proposal";
import { ProposalList } from "./proposal-list";

export class Vehicle {

 
  public id: number;
  public chassi: string;
  public plate: string;
  public model: Model;
  public modelYear: number;
  public version: string;
  public purchaseValue: string;
  public purchaseDate: Date;
  public proposals : ProposalList[];
  public color: Classifier;

}