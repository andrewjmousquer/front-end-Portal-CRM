import { Brand } from "./brand.model";
import { ProductModel } from "./product-model.model";

export class Model {
  public id: number;
  public name: string;
  public active: boolean;
  public brand: Brand;
  public codFipe: string;
  public bodyType: string;
  public size: string;
  public category: string;
  public first: number;
  public productModel: ProductModel[];
}


