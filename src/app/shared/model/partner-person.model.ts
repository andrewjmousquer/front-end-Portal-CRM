import { Classifier } from "./classifier.model";
import { PartnerPersonCommission } from "./partner-person-comission.model";
import { Partner } from "./partner.model";
import { Person } from "./person.model";

export class PartnerPerson {
    public person: Person;
    public partner: Partner;
    public personType: Classifier;
    public commissionList: PartnerPersonCommission[];
}
