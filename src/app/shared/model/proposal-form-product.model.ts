import { ProposalItemModelType } from "./proposal-item-model-type.model";
import { ProposalItemType } from "./proposal-item-type.model";
import { ProposalProduct } from "./proposal-product.model";

export class ProposalFormProduct {
  public proposalProduct: ProposalProduct;
	public proposalItemTypes: ProposalItemType[];
	public proposalItemModelTypes: ProposalItemModelType[];
}
