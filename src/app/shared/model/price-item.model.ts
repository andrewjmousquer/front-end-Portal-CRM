import { Item } from "./item.model";
import { PriceList } from "./price-list-model";

export class PriceItem {
  public id: number;
  public price: number;
  public item: Item;
  public priceList: PriceList;
}
