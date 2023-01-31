import { Classifier } from "./classifier.model";

export class Portion {
  public id: number;
  public name: string;
  public tax: number;
  public paymentType: Classifier;
}
