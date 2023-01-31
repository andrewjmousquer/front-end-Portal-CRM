import { ProductModel } from "./product-model.model";

export class Product {
  public id: number;
  public name: string;
  public active: boolean;
  public proposalExpirationDays: number;
  public productDescription: string;
  public models: ProductModel[];
  public first: number;
  public prlId?: number;
  public over_parceiro?: number;
}
