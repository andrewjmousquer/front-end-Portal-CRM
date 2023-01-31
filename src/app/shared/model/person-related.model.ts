import { Classifier } from "./classifier.model";

export class PersonRelated {
  public id: number;
  public name: string;
  public birthdate: Date;
  public relatedType: Classifier;
  public person: string;
}
