import { Classifier } from "../../model/classifier.model";
import { ItemType } from "../../model/itemtype.model";
import { PriceItem } from "../../model/price-item.model";
import { Product } from "../../model/product.model";
import { ProposalDetailVehicleItem } from "../../model/proposal-detail-vehicle-item.dto";
import { ProposalItemModel } from "../../model/proposal-item-model.model";
import { ItemConfigDTO } from "./item-config.dto";

export class ProposalProductItemDTO {
  public key: string;
  public name: string;
  public price: number;
  public forFree: boolean;
  public canForFree: boolean;
  public amountDiscount: number;
  public percentDiscount: number;
  public finalPrice: number;
  public inactive: boolean;
  public mandatory: Classifier;
  public item: any;
  public config: ItemConfigDTO;
  public configs: ItemConfigDTO[];
  public itemType: ItemType;
  public proposalItem: ProposalItemModel;
  public proposalItems: ProposalItemModel[];
  public proposalItemsAll: ProposalItemModel[];
  public product: Product;
  public pciId: number;
  public remove: boolean;
  public old: any;
}
