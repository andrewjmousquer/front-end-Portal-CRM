
import { Classifier } from "./classifier.model";
import { Seller } from "./seller.model";

export class ProposalList {
	public id: number;
	public num: number;
	public cod: string;
	public orderNumber: number;
	public statusId: Classifier;
	public status: number;
	public client: string;
	public partner: string;
	public executive: Seller;
	public brandModel: string;
	public createDate: Date;
	public validityDate: Date;
	public validityDays: number;
	public dateFollowUp: Date;
	public daysFollowUp: number;
	public totalPrice: number;
	public proposalNumber: number;
	public statusClassification: Classifier;
	public isEdit: boolean;

}

