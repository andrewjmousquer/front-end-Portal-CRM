import { PriceList } from './price-list-model';
import { ProductModel } from './product-model.model';

export class PriceProduct {
  public id: number;
  public price: number;
  public priceList: PriceList;
  public productModel: ProductModel;
}
