import { Item } from "./item.model";
import { Model } from "./model.model";

export class ItemModel {
  public id: number;
  public modelYearStart: number;
  public modelYearEnd: number;
  public item: Item;
  public model: Model;

  // control frontend
  public yearModelLabel: string;
  public yearModel: number;
}
