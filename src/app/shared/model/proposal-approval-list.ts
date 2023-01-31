import { Brand } from "./brand.model";
import { Model } from "./model.model";
import { Partner } from "./partner.model";
import { Person } from "./person.model";
import { Proposal } from "./proposal";
import { ProposalDetailVehicle } from "./proposal-detail-vehicle";
import { Seller } from "./seller.model";


export class ProposalApprovalList {
	public id: number;
	public num: number;
	public proposalNumber: string;
	public orderNumber: number;
	public client: string;
	public partner: string;
	public executive: Seller;
	public brandModel: string;
	public createDate: Date;
	public validityDate: Date;
	public discount: number;
	public totalPrice: number;

}



