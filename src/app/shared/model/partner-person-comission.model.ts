import { Classifier } from "./classifier.model";
import { Partner } from "./partner.model";
import { Person } from "./person.model";

export class PartnerPersonCommission {
    public defaultValue: number;
    public commissionType: Classifier;
    public partner: Partner;
    public person: Person;
}
