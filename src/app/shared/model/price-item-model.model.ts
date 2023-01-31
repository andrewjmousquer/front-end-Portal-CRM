import { Brand } from "./brand.model";
import { ItemModel } from "./item-model.model";
import { Item } from "./item.model";
import { Model } from "./model.model";
import { PriceList } from "./price-list-model";

export class PriceItemModel {
  public id: number;
  public price: number;
  public allModels: boolean;
  public allBrands: boolean;
  public priceList: PriceList;
  public item: Item;
  public itemModel: ItemModel;
  public brand: Brand;
}
