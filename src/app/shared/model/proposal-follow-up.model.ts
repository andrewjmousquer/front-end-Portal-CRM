import { Classifier } from "./classifier.model";
import { Proposal } from "./proposal";

export class ProposalFollowUp {
    id: Number;
    date: Date;
    proposal: number;
    media: Classifier;
    person: String;
    comment: String;
}