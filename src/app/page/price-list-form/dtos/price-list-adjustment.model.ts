import { Product } from "src/app/shared/model/product.model";

export class PriceListAdjustment {
  public action: String = "adjust"; // adjust ou reset
  public change: String = "percent"; // percent ou monetary
  public percentValue: number;
  public monetaryValue: number;
  public product: Product;
  public products: Product[] = [];
}
