import { Vehicle } from "src/app/shared/model/vehicle.model";
import { Model } from "./model.model";
import { PriceProduct } from "./price-product-model";
import { ProposalDetail } from "./proposal-detail.dto";

export class ProposalDetailVehicle {
  public id: number;
  public proposalDetail: ProposalDetail;
  public priceProduct: PriceProduct;
  public vehicle: Vehicle;
  public model: Model;
  public modelYear: number;
  public version: string;

  public productAmountDiscount: number;
  public productPercentDiscount: number;
  public productFinalPrice: number;

  public overPrice: number;
  public overPricePartnerDiscountAmount: number;
  public overPricePartnerDiscountPercent: number;

  public priceDiscountAmount: number;
  public priceDiscountPercent: number;

  public totalAmount: number;
  public totalTaxAmount: number;
  public totalTaxPercent: number;

  public standardTermDays: number;
  public agreedTermDays: number;

  // control frontend
  public productPrice: number;
  public futureDelivery: boolean;
}
