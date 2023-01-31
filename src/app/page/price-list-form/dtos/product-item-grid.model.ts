import { Brand } from "src/app/shared/model/brand.model";
import { Model } from "src/app/shared/model/model.model";
import { PriceProduct } from "src/app/shared/model/price-product-model";
import { ProductModel } from "src/app/shared/model/product-model.model";
import { Product } from "src/app/shared/model/product.model";
import { Utils } from "src/app/shared/util/util";

export class ProductItemGrid {
  public id: number;
  public brand: Brand;
  public model: Model;
  public product: Product;
  public productModel: ProductModel;
  public price: number;
  public error: boolean;
  public errorMsg: String;
  public formatedModelYear: String; // feito aqui para ser usado no filtro

  toPriceProduct = function() {
    let priceProduct = new PriceProduct();
    priceProduct.id = ( this.id < 0 ? null : this.id );
    priceProduct.price = this.price;
    priceProduct.productModel = this.productModel;

    return priceProduct;
  } 

  static toGridItem = function( product: PriceProduct ) {
    let item = new ProductItemGrid();
    item.id = product?.id;
    item.brand = product?.productModel?.model?.brand;
    item.model = product?.productModel?.model;
    item.product = product?.productModel?.product;
    item.productModel = product?.productModel;
    item.price = product?.price;
    item.formatedModelYear = Utils.formatModelYear( product?.productModel?.modelYearStart, product?.productModel?.modelYearEnd );

    return item;
  }
}
