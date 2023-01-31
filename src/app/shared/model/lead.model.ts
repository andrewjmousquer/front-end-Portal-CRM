import { Brand } from "./brand.model";
import { Classifier } from "./classifier.model";
import { Model } from "./model.model";
import { Person } from "./person.model";
import { Seller } from "./seller.model";
import { Source } from "./source.model";

export class Lead {
  public id: number;
  public name: string;
  public createDate: Date;
  public email: string;
  public phone: string;
  public seller: Seller;
  public client: Person;
  public source: Source;
  public status: Classifier;
  public saleProbability: Classifier;
  public model: Model;
  public subject: string;
  public description: string;
  public searchText: string;
  public first: number;
}
