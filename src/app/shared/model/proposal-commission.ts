import { BankAccount } from "./bank-account.model";
import { Classifier } from "./classifier.model";
import { PartnerPerson } from "./partner-person.model";
import { ProposalDetail } from "./proposal-detail.dto";

export class ProposalCommission {
    public id: number;
    public partnerPerson: PartnerPerson;
    public dueDate: Date;
    public value: number;
    public notes: string;
    public commissionType: Classifier;
    public bankAccount: BankAccount;
    public proposalDetail: ProposalDetail;

}
