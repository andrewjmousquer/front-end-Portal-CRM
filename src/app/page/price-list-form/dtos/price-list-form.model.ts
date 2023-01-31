import { Partner } from "src/app/shared/model/partner.model";
import { PriceItemModel } from "src/app/shared/model/price-item-model.model";
import { PriceItem } from "src/app/shared/model/price-item.model";
import { PriceList } from "src/app/shared/model/price-list-model";
import { PriceProduct } from "src/app/shared/model/price-product-model";

export class PriceListForm {
  public priceList: PriceList = new PriceList();
  public products: PriceProduct[] = [];
  public itens: PriceItem[] = [];
  public itensModel: PriceItemModel[] = [];
  public partners: Partner[] = [];
}
