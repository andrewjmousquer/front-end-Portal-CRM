import { Classifier } from "./classifier.model";
import { ItemType } from "./itemtype.model";

export class ProposalItemModel {
  public itmId: number;
  public nameItem: string;
  public cod: string;
  public seq: number;
  public forFree: boolean;
  public generic: boolean;
  public mandatory: Classifier;
  public file: string;
  public icon: string;
  public description: string;
  public hyperlink: string;
  public term: number;
  public termWorkDay: boolean;
  public highlight: boolean;
  public responsability: Classifier;
  public price: number;
  public pimId: number;
  public prlId: number;
  public pciId: number;
  public ittId: number;
  public itemType: ItemType;

  // control front
  public nameItemType: string;
}












