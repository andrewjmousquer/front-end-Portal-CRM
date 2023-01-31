import { ProductModel } from "./product-model.model";

export class ProductModelCost {
  public id: number;
  public productModel: ProductModel;
  public startDate: Date;
  public endDate: Date;
  public totalValue: number;

  // Control Front-End
  public startDateEndDateText: string;
}