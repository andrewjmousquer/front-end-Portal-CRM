import { Classifier } from "./classifier.model";
import { Proposal } from "./proposal";
import { User } from "./user.model";

export class SalesOrder {
  public id: number;
  public orderNumber: number;
  public proposal: Proposal;
  public jiraKey: String;
  public status: Classifier;
  public statusClassification: Classifier;
  public user: User;
}

