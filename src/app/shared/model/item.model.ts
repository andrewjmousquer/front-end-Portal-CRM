import { Classifier } from "./classifier.model";
import { ItemModel } from "./item-model.model";
import { ItemType } from "./itemtype.model";

export class Item {
  public id: number;
  public name: string;
  public cod: string;
  public seq: number = 0;
  public forFree: boolean;
  public generic: boolean;
  public mandatory: Classifier;
  public itemType: ItemType;
  public file: String;
  public icon: String;
  public description: String;
  public hyperlink: String;
  public responsability: Classifier;
  public term: number;
  public termWorkDay: boolean  = false;
  public highlight: boolean = false;
  public itemModels: Array<ItemModel>
  public first: number;
}