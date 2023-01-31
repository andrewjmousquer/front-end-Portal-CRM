import { PriceList } from "src/app/shared/model/price-list-model";

export class PriceListDuplicateItem {
  public priceList: PriceList;
  public channelId: number;
  public partnerId: number;
  public productModelId: number;
  public itemId: number;
  public itemModelId: number;
  public brandId: number;
  public allBrands: boolean;
  public allModels: boolean;
}
