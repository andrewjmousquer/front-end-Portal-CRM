import { PriceItemModel } from "./price-item-model.model";
import { PriceItem } from "./price-item.model";
import { ProposalDetailVehicle } from "./proposal-detail-vehicle.dto";
import { Seller } from "./seller.model";

export class ProposalDetailVehicleItem {
  public id: number;
  public finalPrice: number;
  public forFree: boolean;
  public amountDiscount: number;
  public percentDiscount: number;
  public itemPrice: PriceItem;
  public itemPriceModel: PriceItemModel;
  public proposalDetailVehicle: ProposalDetailVehicle;
  public seller: Seller;
}
