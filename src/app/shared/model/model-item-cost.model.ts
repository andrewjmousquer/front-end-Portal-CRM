import { Brand } from "./brand.model";
import { ItemModel } from "./item-model.model";
import { Item } from "./item.model";

export class ModelItemCost {
  public id: number;
  public itemModel: ItemModel;
  public item: Item;
  public brand: Brand;
  public allBrands: Boolean;
  public allModels: Boolean;
  public startDate: Date;
  public endDate: Date;
  public price: number;
  public first: number;

  public dateFilter: Date;
  public hasValidationError: boolean;
}
