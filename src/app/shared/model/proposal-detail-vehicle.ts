import { PriceProduct } from "./price-product-model";
import { ProposalDetail } from "./proposal-detail";
import { Vehicle } from "./vehicle.model";

export class ProposalDetailVehicle {
    public i: Number;
    public proposalDetail: ProposalDetail;
    public priceProduct: PriceProduct;
    public vehicle: Vehicle;
    public productAmountDiscount: Number;
    public productPercentDiscount: Number;
    public productFinalPrice: Number;
    public overPrice: Number;
    public overPricePartnerDiscountAmount: Number;
    public overPricePartnerDiscountPercent: Number;
    public priceDiscountAmount: Number;
    public priceDiscountPercent: Number;
    public totalAmount: Number;
    public totalTaxAmount: Number;
    public totalTaxPercent: Number;
    public standardTermDays: Number;
    public agreedTermDays: Number;
}
