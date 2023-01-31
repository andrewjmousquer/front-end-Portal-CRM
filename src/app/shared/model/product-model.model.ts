import { Model } from "./model.model";
import { Product } from "./product.model";

export class ProductModel{
    public id: number;
    public hasProject: boolean = false;
    public modelYearStart: number;
    public modelYearEnd: number;
    public manufactureDays: number  ;
    public product: Product;
    public model: Model;
    public first: number;

    // control frontend
    public modelYearText: string;
}