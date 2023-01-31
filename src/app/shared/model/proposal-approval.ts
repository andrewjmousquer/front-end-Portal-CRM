import { Classifier } from "./classifier.model";
import { Person } from "./person.model";
import { Proposal } from "./proposal";

export class ProposalApproval {
  public proposal: Proposal;
  public person: Person;
  public date: Date;
  public status: Classifier;
  public comment: string;
  public discount: number =0;
}
