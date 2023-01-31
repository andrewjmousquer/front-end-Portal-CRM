import { Brand } from "./brand.model";
import { Model } from "./model.model";
import { Partner } from "./partner.model";
import { Seller } from "./seller.model";


export class ProposalApprovalFilter {
    public partner: string[] = [];
    public proposalNum: number;
    public orderNum: string;
    public name: string;
    public executive: string[] = [];
    public brand: Brand;
    public model: Model[];
    public dateType: string;
    public dateIni: Date;
    public dateEnd: Date;
}