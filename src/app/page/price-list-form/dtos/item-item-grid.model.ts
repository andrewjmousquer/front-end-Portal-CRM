import { Brand } from "src/app/shared/model/brand.model";
import { ItemModel } from "src/app/shared/model/item-model.model";
import { Item } from "src/app/shared/model/item.model";
import { Model } from "src/app/shared/model/model.model";
import { PriceItemModel } from "src/app/shared/model/price-item-model.model";
import { PriceItem } from "src/app/shared/model/price-item.model";
import { Utils } from "src/app/shared/util/util";

export class ItemItemGrid {
  public id: number;
  public item: Item;
  public brand: Brand;
  public model: Model;
  public itemModel: ItemModel;
  public price: number;
  public allBrands: Boolean;
  public allModels: Boolean;
  public error: boolean;
  public errorMsg: String;
  public formatedModelYear: String; // feito aqui para ser usado no filtro

  toPriceItem = function() {
    let priceItem = new PriceItem();
    priceItem.id = ( this.id < 0 ? null : this.id );
    priceItem.price = this.price;
    priceItem.item = this.item;
    
    return priceItem;
  } 

  toPriceItemModel = function() {
    let priceItemModel = new PriceItemModel();
    priceItemModel.id = ( this.id < 0 ? null : this.id );
    priceItemModel.price = this.price;
    priceItemModel.allBrands = ( this.allBrands ? this.allBrands : false ) ;
    priceItemModel.allModels = ( this.allModels ? this.allModels : false );
    priceItemModel.item = this.item;
    priceItemModel.brand = this.brand;
    priceItemModel.itemModel = this.itemModel;
    
    return priceItemModel;
  }

  static toGridItem = function( item: PriceItem ) {
    let itemGrid = new ItemItemGrid();
    itemGrid.id = item?.id;
    itemGrid.item = item?.item;
    itemGrid.price = item?.price;

    return itemGrid;
  }
  
  static toGridItemModel = function( item: PriceItemModel ) {
    let itemGrid = new ItemItemGrid();
    itemGrid.id = item?.id;
    itemGrid.brand = item?.brand;
    itemGrid.model = item?.itemModel?.model;
    itemGrid.item = item?.item;
    itemGrid.itemModel = item?.itemModel;
    itemGrid.allBrands = item?.allBrands;
    itemGrid.allModels = item?.allModels;
    itemGrid.price = item?.price;
    itemGrid.formatedModelYear = Utils.formatModelYear( item?.itemModel?.modelYearStart, item?.itemModel?.modelYearEnd );

    return itemGrid;
  }
}
