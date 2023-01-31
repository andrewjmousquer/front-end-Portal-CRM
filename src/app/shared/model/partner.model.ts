import { Brand } from "./brand.model";
import { Channel } from "./channel-model";
import { Classifier } from "./classifier.model";
import { PartnerGroup } from "./partner-group.model";
import { PartnerPerson } from "./partner-person.model";
import { Person } from "./person.model";
import { Seller } from "./seller.model";

export class Partner {
    public id: number;
    public person: Person;
    public situation: Classifier;
    public additionalTerm: number;
    public channel: Channel;
    public partnerGroup: PartnerGroup;
    public brandList: Brand[];
    public employeeList: PartnerPerson[];
    public sellerList: Seller[];
    public first: number;
    public isAssistance: boolean;
}
