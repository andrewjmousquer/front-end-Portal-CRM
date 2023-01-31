import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { ModelFormService } from 'src/app/page/model-form/model-form.service';
import { ProductFormService } from 'src/app/page/product-form/product-form.service';
import { VehicleService } from 'src/app/page/vehicle-form/vehicle-form.service';
import { ItemConfigDTO } from 'src/app/shared/dto/proposal/item-config.dto';
import { ProposalProductItemFormDTO } from 'src/app/shared/dto/proposal/proposal-product-item-form.dto';
import { ProposalProductItemDTO } from 'src/app/shared/dto/proposal/proposal-product-item.dto';
import { ProposalTotalDTO } from 'src/app/shared/dto/proposal/proposal-total.dto';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { EventTypeEnum } from 'src/app/shared/enum/event-type-enum';
import { MandatoryEnum } from 'src/app/shared/enum/mandatory-enum';
import { PayerTypeEnum } from 'src/app/shared/enum/payer-type-enum';
import { ProductItemEnum } from 'src/app/shared/enum/product-item-enum';
import { Brand } from 'src/app/shared/model/brand.model';
import { Channel } from 'src/app/shared/model/channel-model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Item } from 'src/app/shared/model/item.model';
import { Model } from 'src/app/shared/model/model.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { PaymentMethod } from 'src/app/shared/model/payment-method.model';
import { PaymentRule } from 'src/app/shared/model/payment-rule.model';
import { PriceItemModel } from 'src/app/shared/model/price-item-model.model';
import { PriceItem } from 'src/app/shared/model/price-item.model';
import { PriceList } from 'src/app/shared/model/price-list-model';
import { PriceProduct } from 'src/app/shared/model/price-product-model';
import { ProductModel } from 'src/app/shared/model/product-model.model';
import { Product } from 'src/app/shared/model/product.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProposalDetailVehicleItem } from 'src/app/shared/model/proposal-detail-vehicle-item.dto';
import { ProposalDetailVehicle } from 'src/app/shared/model/proposal-detail-vehicle.dto';
import { ProposalDetail } from 'src/app/shared/model/proposal-detail.dto';
import { ProposalFormProduct } from 'src/app/shared/model/proposal-form-product.model';
import { ProposalItemModel } from 'src/app/shared/model/proposal-item-model.model';
import { ProposalPayment } from 'src/app/shared/model/proposal-payment.model';
import { Seller } from 'src/app/shared/model/seller.model';
import { Vehicle } from 'src/app/shared/model/vehicle.model';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ParameterService } from 'src/app/shared/service/parameter.service';
import { PaymentMethodService } from 'src/app/shared/service/payment-method.service';
import { PaymentRuleService } from 'src/app/shared/service/paymentrule.service';
import { PaymentRuleUtil } from 'src/app/shared/util/payment-rule.util';
import { UserUtil } from 'src/app/shared/util/user.util';
import { ProposalFormService } from '../../proposal-form.service';

@Component({
  selector: 'wbp-proposal-partner',
  templateUrl: './proposal-partner.component.html',
  styles: ['.ui-multiselect-panel .ui-multiselect-empty-message { display: none !important;}']
})
export class ProposalPartnerComponent implements OnInit {

  @Input() proposal: Proposal;
  @Input() registerForm: NgForm;
  @Input() channelList: Channel[];
  @Input() riskList: Classifier[];

  @Output() updateRegister: EventEmitter<Proposal> = new EventEmitter();

  _: any = _;
  userUtil: any = UserUtil;

  isEdit: boolean = false;
  mandatoryEnum: any = MandatoryEnum;
  isLoadExecutive: boolean = false;
  proposalTotal: ProposalTotalDTO;
  idChannelOld: number;
  loadContract: boolean;

  executiveList: Seller[];
  sellerList: Seller[];
  brandList: Brand[];
  productList: Product[];
  productItemList: ProposalProductItemDTO[] = [];
  productItemListAll: ProposalProductItemDTO[] = [];
  productItemProposalList: ProposalProductItemDTO[] = [];
  modelList: Model[];
  commisResumeList: any[];
  partnerList: Partner[];
  payerTypeList: Classifier[];
  eventTypeList: Classifier[];
  itemMandatoryList: Classifier[];
  paymentMethodList: PaymentMethod[];
  paymentMethodOriginalList: PaymentMethod[];
  daysList: Classifier[];
  proposalItemsList: ProposalItemModel[];

  proposalFormProduct: ProposalFormProduct;

  colsFinancial: any[];
  colsCommisResume: any[];
  colsCommission: any[];

  channel: Channel;
  itemRegister: ProposalDetailVehicleItem;
  productItemRegister: ProposalProductItemDTO;
  vehicleCopy: Vehicle;

  proposalItemSelected: ProposalProductItemDTO;
  proposalItemsDisabled: boolean;
  canEditPaymentMain: boolean;

  proposalPaymentMainDays: number;
  proposalMinDueDate: Date = new Date();
  proposalMaxDueDate: Date = new Date();

  totalBlindagemSemPpicionais: number = 0;

  proposalId: number;

  parameterQuantityDays: number;

  totalBlindagemSemOpicionais: number = 0;
  totalOpicionais: number = 0;
  totalDesconto: number = 0;
  total: number = 0;

  showBotton: boolean;

  colorList: Classifier[] = new Array<Classifier>();


  @Input() partnerShowFirstSelected: boolean;


  @ViewChild('dt', { static: false }) dt: any;

  constructor(
    private classifierService: ClassifierService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private modelService: ModelFormService,
    private proposalFormService: ProposalFormService,
    private vehicleService: VehicleService,
    private productService: ProductFormService,
    private paymentMethodService: PaymentMethodService,
    private paymentRuleService: PaymentRuleService,
    private parameterService: ParameterService,
    private app: AppComponent
  ) { }

  ngOnInit(): void {

    this.colsFinancial = [
      { field: 'Evento', header: 'Evento', class: 'w-12rem' },
      { field: 'Data Pactuada', header: 'Data Pactuada', class: 'w-12rem' },
      { field: 'Qtde. de Dias', header: 'Qtde. de Dias', class: 'w-12rem' },
      { field: 'Valor', header: 'Valor', class: 'w-12rem' },
      { field: 'Porcent.', header: 'Porcent.', class: 'w-10rem' },
      { field: 'Meio de Pagamento', header: 'Meio de Pagamento', class: 'w-14rem' },
      { field: 'Parcelas', header: 'Parcelas', class: 'w-14rem' },
      { field: 'Valor da Parcela', header: 'Valor da Parcela', class: 'w-14rem' },
      { field: 'Juros', header: 'Juros', class: 'w-14rem' },
      { field: 'Pré Aprovado', header: 'Pré Aprovado', class: 'w-10rem' },
      { field: 'Fat. Ant?', header: 'Fat. Ant?', class: 'w-8rem justify-content-center' },
      { field: 'Pagador', header: 'Pagador', class: 'w-8rem' }
    ];

    this.colsCommission = [
      { field: 'Tipo Comissionado', header: 'Pagador' },
      { field: 'Dados do Comissionado', header: 'Dados do Comissionado' },
      { field: 'Valor', header: 'Valor', class: 'text-right' },
      { field: 'Vencimento', header: 'Vencimento' },
      { field: 'Tipo Comissão', header: 'Tipo Comissão' },
      { field: 'Dados de Pagamento', header: 'Dados de Pagamento' }
    ];

    this.colsCommisResume = [
      { field: 'label', header: '' },
      { field: 'total', header: 'Total' },
      { field: 'applied', header: 'Aplicado' },
      { field: 'sale', header: 'Saldo' },
    ];

    this.commisResumeList = [
      { label: 'Comissão', total: 9200, applied: 9200, sale: 0 },
      { label: 'Bônus', total: null, applied: 400, sale: null },
      { label: 'Paga Prêmio', total: null, applied: 600, sale: null },
      { label: 'Valor Total', total: null, applied: 10200, sale: null },
    ];

    this.canEditPaymentMain = this.app?.getCurrentUser?.accessList?.checkpoints?.findIndex(c => c.name.toLocaleUpperCase() == 'PROPOSAL.EDIT.PAYMENT.MAIN') >= 0;
    this.proposal = new Proposal();
    this.proposal.proposalDetail = new ProposalDetail();
    this.proposal.proposalDetailVehicle = new ProposalDetailVehicle();
    this.proposal.proposalDetailVehicle.vehicle = new Vehicle();
    this.proposal.proposalDetailVehicle.vehicle.model = new Model();
    this.proposal.proposalDetailVehicle.vehicle.model.brand = new Brand();
    this.proposal.proposalDetailVehicle.model = new Model();
    this.proposal.proposalDetailVehicle.model.brand = new Brand();
    this.proposal.proposalDetailVehicle.priceProduct = new PriceProduct();
    this.proposal.proposalDetailVehicle.priceProduct.productModel = new ProductModel();
    this.proposal.proposalDetailVehicle.priceProduct.priceList = new PriceList();
    this.proposal.proposalDetailVehicle.priceProduct.productModel.product = new Product();

    this.itemRegister = new ProposalDetailVehicleItem();
    this.itemRegister.itemPrice = new PriceItem();
    this.proposalFormProduct = new ProposalFormProduct();
    this.proposalTotal = new ProposalTotalDTO();

    this.resetProductItemRegister();
    this.loadExecutiveList();
    this.loadPaymentMethod();
    this.loadPayerTypeList();
    this.loadEventTypeList();
    this.loadItemMandatoryList();
    this.loadSeller();
    this.loadProposalPaymentMainDays();
    this.loadColorList();
  }

  ngOnChanges(): void {
    if (!this.isLoadExecutive && this.proposal.proposalDetail && this.proposal.proposalDetail.channel) {
      if (this.proposal.id) {
        this.partnerShowFirstSelected = true;
      }
      this.isLoadExecutive = true;
      this.isEdit = true;

      if (!this.proposal.proposalDetailVehicle.vehicle) {
        this.proposal.proposalDetailVehicle.vehicle = new Vehicle();
        this.proposal.proposalDetailVehicle.vehicle.model = new Model();
        this.proposal.proposalDetailVehicle.vehicle.model.brand = new Brand();

        this.proposal.proposalDetailVehicle.futureDelivery = true;
      }

      if (this.proposal?.proposalPayment?.length > 0) {
        this.proposal.proposalPayment.map(payment => {
          if (payment.payer.value == 'PARTNER' && this.proposal.contract) {
            return this.loadContract = true;
          }
          else return this.loadContract = false;
        });
      }

      this.loadExecutiveList();
      this.loadBrandByPartner();
      this.loadModelList();
      this.loadProductByModel(true);
      this.loadProductItens(true);
    }
    this.buildPayment();
  }

  ngDoCheck(): void {
    this.updateRegister.emit(this.proposal);
    this.buildCheckProposal();
  }

  resetProductItemRegister() {
    this.productItemRegister = new ProposalProductItemDTO();
  }

  resetProductItemProposalList(initial?: boolean) {
    this.productItemProposalList = [];
    !initial && this.buildProposalOutput();
  }

  newProductItemList(item: any, key: any, type: ProductItemEnum, name?: string, model?: any, old?: any) {
    let prodItem = new ProposalProductItemDTO();
    prodItem.key = `${type}${key}`;
    prodItem.mandatory = item.mandatory;
    prodItem.inactive = item.mandatory == MandatoryEnum.required;
    prodItem.canForFree = item.forFree;
    prodItem.old = _.cloneDeep(old);
    prodItem.amountDiscount = 0.0;
    prodItem.remove = false;

    let itemPrice = item.itemPrice || item.itemPriceModel;

    if (itemPrice && itemPrice.item) {
      prodItem.mandatory = itemPrice.item.mandatory;
      prodItem.canForFree = itemPrice.item.forFree;
    }

    switch (type) {
      case ProductItemEnum.product:
        prodItem.product = item;
        prodItem.price = item.price;
        prodItem.finalPrice = item.price;
        prodItem.canForFree = item.forFree;
        prodItem.name = name || item.nameItem || item.nameItemType;
        prodItem.mandatory = this.itemMandatoryList.find(data => data.value == MandatoryEnum.required);
        break;

      default:
        prodItem.item = item;
        prodItem.name = name || item.name || item.nameItem || item.nameItemType;
        prodItem.itemType = item.itemType || (itemPrice && itemPrice.item && itemPrice.item.itemType);

        prodItem.remove = prodItem.itemType
          && ((prodItem.itemType.mandatory && prodItem.itemType.multi && prodItem.mandatory.value != MandatoryEnum.required)
            || (!prodItem.itemType.mandatory && !prodItem.itemType.multi)
            || (!prodItem.itemType.mandatory && prodItem.itemType.multi));

        let items = item.proposalItems || item.proposalItemModels;
        if (items) {
          prodItem.configs = _.uniqWith(items.map(pi => {
            let cod = pi.cod.toUpperCase();
            return new ItemConfigDTO(cod, cod);
          }), _.isEqual);
          prodItem.config = prodItem.configs[0];
          prodItem.itemType = items[0].itemType;
        }
        break;
    }

    if (model) {
      let modelItemPrice = model.itemPrice || model.itemPriceModel;
      if (modelItemPrice && modelItemPrice.item && modelItemPrice.item.cod) {
        let cod = modelItemPrice.item.cod;
        let productItem = this.productItemListAll.find(x => x.key == prodItem.key);
        prodItem.config = new ItemConfigDTO(cod, cod);
        if (productItem) {
          prodItem.configs = productItem.configs;
          prodItem.proposalItemsAll = productItem.proposalItemsAll;
        }

        prodItem.proposalItem = this.convertItemToProposalItemModel(model);
        this.changeConfigItem(cod, prodItem);
      }
      prodItem.price = modelItemPrice ? modelItemPrice.price : model.price;
      prodItem.finalPrice = model.finalPrice;
      prodItem.forFree = model.forFree;
      prodItem.amountDiscount = model.amountDiscount;
    }

    return prodItem;
  }

  buildCheckProposal() {
    let idChannel = this.proposal.proposalDetail?.channel?.id;
    if (idChannel && idChannel != this.idChannelOld) {
      this.changeChannel(false);
    }
  }

  buildProductItemListAll(data: ProposalFormProduct) {
    this.productItemListAll = [];
    // itemModel
    data.proposalItemModelTypes.map(item => {
      if (item.proposalItemModels[0].cod) {
        let newItem = this.newProductItemList(
          item,
          item.proposalItemModels[0].ittId,
          ProductItemEnum.itemType,
          null,
          null,
          item);

        newItem.proposalItems = item.proposalItemModels;
        newItem.proposalItemsAll = item.proposalItemModels;
        this.productItemListAll.push(newItem);

      } else {
        item.proposalItemModels.map(itemM => {
          this.productItemListAll.push(this.newProductItemList(
            this.convertItemModelToVehicleItem(itemM),
            itemM.itmId,
            ProductItemEnum.itemModel,
            itemM.nameItem,
            null,
            itemM));
        });
      }
    });

    // itemType
    data.proposalItemTypes.map(item => {
      if (!item.proposalItems) return;

      if (item.proposalItems[0].cod) {
        let newItem = this.newProductItemList(
          item,
          item.proposalItems[0].ittId,
          ProductItemEnum.itemType,
          null,
          null,
          item);
        newItem.proposalItems = item.proposalItems;
        newItem.proposalItemsAll = item.proposalItems;
        this.productItemListAll.push(newItem);

      } else {
        item.proposalItems.map(im => {
          this.productItemListAll.push(this.newProductItemList(
            this.convertItemModelToVehicleItem(im),
            im.itmId,
            ProductItemEnum.item,
            im.nameItem,
            null,
            im));
        });
      }
    });
  }

  buildProductItemList() {
    this.productItemList = [];
    this.productItemListAll.map(item => {
      if (!this.productItemProposalList.find(x => x.key == item.key)) {
        this.productItemList.push(item);
      }
    });
  }

  buildProposalProduct(data: ProposalFormProduct) {
    // product
    let idProduct = this.proposal.proposalDetailVehicle.priceProduct.productModel.product?.id;
    let nameProduct = this.proposal.proposalDetailVehicle.priceProduct.productModel.product?.name;

    let product = this.newProductItemList(
      data.proposalProduct,
      idProduct,
      ProductItemEnum.product,
      nameProduct,
      null,
      data.proposalProduct);

    this.proposal.proposalDetailVehicle.productFinalPrice = product.finalPrice;

    // if (this.proposal.proposalDetailVehicle.productFinalPrice) {
    product.amountDiscount = this.proposal.proposalDetailVehicle.productAmountDiscount || 0;
    product.finalPrice = this.proposal.proposalDetailVehicle.productFinalPrice;
    product.percentDiscount = this.proposal.proposalDetailVehicle.productPercentDiscount;
    // }

    this.productItemProposalList.push(product);
  }

  buildProductItemListProposal(data: ProposalFormProduct) {
    // build to save
    this.proposal.proposalDetailVehicle.priceProduct.id = data.proposalProduct.pprId;
    this.proposal.proposalDetailVehicle.priceProduct.priceList.id = data.proposalProduct.prlId;

    this.buildProposalProduct(data);

    // items
    if (this.proposal.proposalDetailVehicleItem) {
      this.proposal.proposalDetailVehicleItem.map(vehItem => {
        let itemPrice = vehItem.itemPrice || vehItem.itemPriceModel;

        vehItem.amountDiscount = vehItem.amountDiscount || 0;
        vehItem.percentDiscount = vehItem.percentDiscount || 0;
        vehItem.finalPrice = vehItem.finalPrice || 0;

        if (itemPrice && itemPrice.item && itemPrice.item.itemType) {
          let key = `${ProductItemEnum.itemType}${itemPrice.item.itemType.id}`;
          let itemEnum = vehItem.itemPrice ? ProductItemEnum.item : ProductItemEnum.itemModel;

          if (itemPrice.item.cod) {
            let group = this.productItemProposalList.find(itemP => {
              return itemP.key == key;
            });

            if (!group) {
              let tmp = this.newProductItemList(
                vehItem,
                itemPrice.item.itemType.id,
                ProductItemEnum.itemType,
                itemPrice.item.itemType.name,
                vehItem,
                vehItem
              )
              this.productItemProposalList.push(tmp);
            }
          } else {
            let item = vehItem.itemPrice ? vehItem.itemPrice.item : vehItem.itemPriceModel.item;

            let tmp = this.newProductItemList(
              vehItem,
              item.id,
              itemEnum,
              item.name,
              vehItem,
              vehItem)
            this.productItemProposalList.push(tmp);
          }
        }
      });
    }
  }

  buildProductItemListRequired() {
    this.productItemListAll.map(item => {
      if (this.productItemProposalList.find(x => x.key == item.key)) return;
      let itemCopy = _.cloneDeep(item);
      itemCopy.amountDiscount = 0;

      if ((item.old.proposalItems && item.old.proposalItems.length)
        || item.old.proposalItemModels && item.old.proposalItemModels.length) {

        let itens = item.old.proposalItems || item.old.proposalItemModels;

        if (itens[0].itemType.mandatory) {
          let required = itens[0];
          itemCopy.proposalItem = required;
          itemCopy.config = new ItemConfigDTO(required.cod, required.cod);
          itemCopy.price = required.price;
          itemCopy.finalPrice = required.price;
          itemCopy.canForFree = required.forFree;
          this.changeConfigItem(required.cod, itemCopy);
          this.productItemProposalList.push(itemCopy);
        }
      } else if ((item.old.itemType && item.mandatory.value == MandatoryEnum.required && item.old.itemType.mandatory)
        || (item.old.mandatory.value != this.mandatoryEnum.optional)) {
        itemCopy.price = item.old.price;
        itemCopy.finalPrice = item.old.price;
        itemCopy.canForFree = item.old.forFree;
        this.productItemProposalList.push(itemCopy);
      }
    });
    this.buildProposalDetailVehicleItem();
  }

  buildProposalDetailVehicleItem() {
    if (this.productItemProposalList) {
      this.proposal.proposalDetailVehicleItem = [];

      this.productItemProposalList && this.productItemProposalList.map(item => {
        let itemPrice = item.item && (item.item.itemPrice || item.item.itemPriceModel);

        if (item.key.search(ProductItemEnum.product) >= 0) {
          this.proposal.proposalDetailVehicle.productAmountDiscount = item.amountDiscount;
          this.proposal.proposalDetailVehicle.productPercentDiscount = item.percentDiscount;
          this.proposal.proposalDetailVehicle.productFinalPrice = item.finalPrice;
          this.proposal.proposalDetailVehicle.productPrice = item.price;

        } else {
          let newItem = new ProposalDetailVehicleItem();
          newItem.id = item.old?.id;
          newItem.finalPrice = item.finalPrice;
          newItem.forFree = item.forFree;
          newItem.amountDiscount = item.amountDiscount;
          newItem.percentDiscount = item.percentDiscount;
          newItem.seller = new Seller();
          newItem.seller.id = this.proposal.proposalDetail.seller?.id;

          if (itemPrice && itemPrice.id) {
            if (item.item.itemPrice && item.item.itemPrice.id) {
              newItem.itemPrice = item.item.itemPrice;
              newItem.itemPrice.item.mandatory = item.mandatory;
            }
            if (item.item.itemPriceModel && item.item.itemPriceModel.id) {
              newItem.itemPriceModel = item.item.itemPriceModel;
              newItem.itemPriceModel.item.mandatory = item.mandatory;
            }
          } else {
            // ITEM TYPE (TP)
            if (item.proposalItem.pciId) {
              let itemPrice = new PriceItem();
              itemPrice.id = item.proposalItem.pciId;
              newItem.itemPrice = itemPrice;
              newItem.itemPrice.item = new Item();
              newItem.itemPrice.item.mandatory = item.mandatory;
            } else {
              let itemPriceModel = new PriceItemModel();
              itemPriceModel.id = item.proposalItem.pimId;
              newItem.itemPriceModel = itemPriceModel;
              newItem.itemPriceModel.item = new Item();
              newItem.itemPriceModel.item.mandatory = item.mandatory;
            }
          }
          this.proposal.proposalDetailVehicleItem.push(newItem);
        }
      });
    }
  }

  buildPayment() {
    this.proposal?.proposalPayment?.map(payment => {
      this.changeEventType(payment);
      this.loadInstallmentsList(payment.paymentMethod, payment);
    });
    this.updateProposalPaymentPositions();
  }

  buildProposalDays(isNew?: boolean) {

    if (this.proposal.id && !isNew) {
      return
    }


    if (!this.proposal.id && isNew || !this.proposal.proposalDetailVehicle.standardTermDays) {

      this.productService.getById(this.proposal.proposalDetailVehicle.priceProduct.productModel.product.id)
        .pipe(first()).subscribe(data => {
          let modelProduct = data.models.find(m => {
            let year = this.proposal.proposalDetailVehicle.modelYear;
            return m.model.brand.id == this.proposal.proposalDetailVehicle.model.brand.id
              && m.model.id == this.proposal.proposalDetailVehicle.model.id
              && m.modelYearStart <= year
              && m.modelYearEnd >= year
          });

          let days = modelProduct ? modelProduct.manufactureDays : 0;

          if (this.proposal && this.proposal.proposalDetail && this.proposal.proposalDetail.partner && this.proposal.proposalDetail.partner.additionalTerm) {
            days += this.proposal.proposalDetail.partner ? this.proposal.proposalDetail.partner.additionalTerm : 0;
          }

          if (this.proposal.proposalDetailVehicleItem) {
            this.proposal.proposalDetailVehicleItem.forEach(item => {
              if (item.itemPriceModel && item.itemPriceModel.item && item.itemPriceModel.item.term) {
                days += item.itemPriceModel.item.term;
              }
              if (item.itemPrice && item.itemPrice.item && item.itemPrice.item.term) {
                days += item.itemPrice.item.term;
              }
            });
          }


          this.proposal.proposalDetailVehicle.standardTermDays = days;
          this.proposal.proposalDetailVehicle.agreedTermDays = this.proposal.proposalDetailVehicle.agreedTermDays || days;
        });
    }
  }

  buildProposalOutput() {
    this.buildProposalDetailVehicleItem();
    this.calSumTotal();
  }

  changeChannel(resetPartner?: boolean) {

    if (resetPartner) {

      this.partnerShowFirstSelected = false;

      this.proposal.proposalDetailVehicle.overPrice = 0;
      this.proposal.proposalDetail.partner = new Partner;

      this.productItemProposalList = [];
      this.proposalTotal.productPrice = 0;
      this.proposalTotal.productAmountDiscount = 0;
      this.proposalTotal.productFinalPrice = 0;
      this.proposal.proposalDetailVehicle.totalAmount = 0;
      this.proposal.proposalDetailVehicle.totalTaxAmount = 0;
      this.proposal.proposalDetailVehicle.priceDiscountAmount = 0;
      this.proposal.proposalDetailVehicle.standardTermDays = 0;
      this.proposal.proposalDetailVehicle.agreedTermDays = 0;
      this.proposal.proposalDetailVehicle.priceProduct.productModel.product = new Product;
      this.proposal.proposalDetailVehicle.vehicle = new Vehicle;
      this.proposal.proposalDetailVehicle.vehicle.model = new Model;
      this.proposal.proposalDetailVehicle.vehicle.model.brand = new Brand;
      this.proposal.proposalDetailVehicle.vehicle.model.brand.name = "";
      this.proposal.proposalDetailVehicle.vehicle.modelYear = null;
      this.proposal.proposalPayment = []

      if (!this.proposal.proposalDetail.channel.hasPartner) {
        this.loadBrandByPartner();
      }

    }
    this.loadPartnerByExecutive();

  }

  changeExecutive() {

    this.brandList = [];
    this.partnerList = [];
    this.proposal.proposalDetail.partner = new Partner;
    this.productItemProposalList = [];
    this.proposalTotal.productPrice = 0;
    this.proposalTotal.productAmountDiscount = 0;
    this.proposalTotal.productFinalPrice = 0;
    this.proposal.proposalDetailVehicle.overPrice = 0;
    this.proposal.proposalDetailVehicle.totalAmount = 0;
    this.proposal.proposalDetailVehicle.totalTaxAmount = 0;
    this.proposal.proposalDetailVehicle.priceDiscountAmount = 0;
    this.proposal.proposalDetailVehicle.standardTermDays = 0;
    this.proposal.proposalDetailVehicle.agreedTermDays = 0;
    this.proposal.proposalDetailVehicle.priceProduct.productModel.product = new Product;
    this.proposal.proposalDetailVehicle.vehicle = new Vehicle;
    this.proposal.proposalDetailVehicle.vehicle.model = new Model;
    this.proposal.proposalDetailVehicle.vehicle.model.brand = new Brand;
    this.proposal.proposalDetailVehicle.vehicle.model.brand.name = "";
    this.proposal.proposalDetailVehicle.vehicle.modelYear = null;
    this.proposal.proposalPayment = []


    this.loadPartnerByExecutive();


  }

  changePartner() {

    this.productItemProposalList = [];
    this.proposal.proposalDetailVehicle.overPrice = 0;
    this.proposalTotal.productPrice = 0;
    this.proposalTotal.productAmountDiscount = 0;
    this.proposalTotal.productFinalPrice = 0;
    this.proposal.proposalDetailVehicle.totalAmount = 0;
    this.proposal.proposalDetailVehicle.totalTaxAmount = 0;
    this.proposal.proposalDetailVehicle.priceDiscountAmount = 0;
    this.proposal.proposalDetailVehicle.standardTermDays = 0;
    this.proposal.proposalDetailVehicle.agreedTermDays = 0;
    this.proposal.proposalDetailVehicle.priceProduct.productModel.product = new Product;
    this.proposal.proposalDetailVehicle.vehicle = new Vehicle;
    this.proposal.proposalDetailVehicle.vehicle.model = new Model;
    this.proposal.proposalDetailVehicle.vehicle.model.brand = new Brand;
    this.proposal.proposalDetailVehicle.vehicle.model.brand.name = "";
    this.proposal.proposalDetailVehicle.vehicle = new Vehicle;
    this.proposal.proposalDetailVehicle.model = new Model;
    this.proposal.proposalDetailVehicle.model.brand = new Brand;
    this.proposal.proposalDetailVehicle.model.brand.name = "";
    this.proposal.proposalDetailVehicle.modelYear = null;
    this.proposal.proposalDetailVehicle.version = null;
    this.proposal.proposalPayment = []
    this.loadBrandByPartner();
  }

  changeBrand() {
    this.proposal.proposalDetailVehicle.vehicle.modelYear = null;
    this.proposal.proposalDetailVehicle.modelYear = null;
    this.proposal.proposalDetailVehicle.priceProduct.productModel.product = new Product;
    this.resetProductItemProposalList();
    this.loadModelList();
    this.proposal.proposalPayment = [];
  }

  changeModel() {
    this.proposal.proposalDetailVehicle.priceProduct.productModel.product = new Product;
    this.resetProductItemProposalList();
    this.loadProductByModel();
  }

  changeProduct() {
    this.proposal.proposalDetailVehicle.overPrice = this.proposal.proposalDetailVehicle.priceProduct.productModel.product.over_parceiro;
    this.proposal.proposalPayment = [];
    this.proposal.proposalDetailVehicle.overPricePartnerDiscountAmount = 0;
    this.proposal.proposalDetailVehicle.priceDiscountAmount = 0;
    this.proposal.proposalDetailVehicle.agreedTermDays = 0;
    this.totalBlindagemSemOpicionais = 0;
    this.totalOpicionais = 0;
    this.totalDesconto = 0;
    this.total = 0;
    this.proposalItemSelected = new ProposalProductItemDTO();
    this.loadProductItens();
    //this.addProposalPayment(true);
    //this.addProposalPayment();
    // this.confirmationService.confirm({
    //   message: `A troca de produto removerá os itens já selecionados, deseja continuar?`,
    //   header: 'Substituir os itens selecionados',
    //   acceptLabel: 'Substituir',
    //   rejectLabel: 'Cancelar',
    //   accept: () => {
    //   }
    // });
  }

  changePlate() {
    this.loadValidPlate();
  }

  changeChassi() {
    this.loadValidChassi();
  }

  changeProductItem() {
    let value = this.proposalItemSelected;
    this.proposalItemsList = [];
    this.proposalItemsDisabled = true;
    this.productItemRegister = new ProposalProductItemDTO();

    this.productItemListAll.map(item => {
      item.inactive = item.key != this.proposalItemSelected.key;
    });

    this.proposalItemsList = value.item.proposalItems || value.item.proposalItemModels;

    if (value.item
      && (value.item.proposalItems && value.item.proposalItems.length
        || value.item.proposalItemModels && value.item.proposalItemModels.length)) {
      this.proposalItemsDisabled = false;
    } else {
      let itemPrice = value.item.itemPrice || value.item.itemPriceModel;
      this.productItemRegister.price = itemPrice.price;
      this.productItemRegister.amountDiscount = 0;
      this.productItemRegister.finalPrice = itemPrice.price;
      this.productItemRegister.canForFree = value.item.forFree;
    }
  }

  changeProposalItems() {
    if (this.productItemRegister.proposalItem) {
      this.productItemRegister.forFree = false;
      this.productItemRegister.price = this.productItemRegister.proposalItem.price;
      this.productItemRegister.amountDiscount = 0;
      this.productItemRegister.finalPrice = this.productItemRegister.proposalItem.price;
      this.productItemRegister.canForFree = this.productItemRegister.proposalItem.forFree;
    }
  }

  changeForFree(checked, item: ProposalProductItemDTO) {
    if (checked) {
      item.amountDiscount = item.price;
      item.finalPrice = 0;
    } else {
      item.amountDiscount = 0;
      item.finalPrice = item.price;
    }
    this.calSumTotal();
    this.buildProposalDetailVehicleItem();
    this.recalcProposalPayment();
  }

  changeConfigItem(value, item: ProposalProductItemDTO, changeItem?: boolean) {

    item.proposalItems = item.proposalItemsAll && item.proposalItemsAll.filter(i => {
      return i.cod.toUpperCase() == value.toUpperCase();
    });
    if (changeItem) {
      this.changeItem(item.proposalItems[0], item);
    }

    // XU
    //this.addProposalPayment();
  }

  changeItem(value, item: ProposalProductItemDTO) {
    let itemValue = value;
    item.proposalItem = itemValue;
    item.price = itemValue.price;
    item.amountDiscount = 0;
    item.finalPrice = item.price;
    item.forFree = false;
    item.canForFree = itemValue.forFree;
    item.pciId = itemValue.pciId;
    this.buildProposalOutput();

    this.addProposalPayment();
  }

  changeFutureDelivery() {
    if (this.proposal.proposalDetailVehicle.futureDelivery) {
      this.vehicleCopy = _.cloneDeep(this.proposal.proposalDetailVehicle.vehicle);
      this.proposal.proposalDetailVehicle.vehicle.plate = null;
      this.proposal.proposalDetailVehicle.vehicle.chassi = null;
      this.proposal.proposalDetailVehicle.vehicle.purchaseValue = null;
      this.proposal.proposalDetailVehicle.vehicle.purchaseDate = null;
      this.proposal.proposalDetailVehicle.vehicle.version = null;
    } else {
      this.proposal.proposalDetailVehicle.vehicle.plate = this.vehicleCopy.plate;
      this.proposal.proposalDetailVehicle.vehicle.chassi = this.vehicleCopy.chassi;
      this.proposal.proposalDetailVehicle.vehicle.purchaseValue = this.vehicleCopy.purchaseValue;
      this.proposal.proposalDetailVehicle.vehicle.purchaseDate = this.vehicleCopy.purchaseDate;
      this.proposal.proposalDetailVehicle.vehicle.version = this.vehicleCopy.version;
    }
  }

  changePaymentMethod(paymentMethod: PaymentMethod, payment: ProposalPayment) {
    payment.showPaymentPreApproved = false;
    this.loadInstallmentsList(paymentMethod, payment);
    payment.paymentRule = null;
    payment.installmentAmount = 0;
    payment.interest = 0;
    this.proposal.proposalDetailVehicle.totalTaxAmount = 0;
  }

  changeEventType(payment: ProposalPayment) {
    let list = [EventTypeEnum.FIXED_DATE, EventTypeEnum.CHECK_IN, EventTypeEnum.CHECK_OUT, EventTypeEnum.AUTORIZACAO_DE_FATURAMENTO_BANCARIO];
    payment.showDueDate = list.findIndex(e => e == payment.event.value) >= 0;
    payment.canEditDueDate = payment.event.value == EventTypeEnum.FIXED_DATE;
    payment.dueDate = payment.canEditDueDate ? payment.dueDate : null;

    payment.canNotGenerateAcconuts = payment.showDueDate ? false : true;
    if (!payment.showDueDate && payment.canNotGenerateAcconuts) {
      payment.paymentMethod = null;
      payment.paymentRule = null;
      payment.installmentAmount = payment.paymentAmount;
      payment.interest = 0;
      this.calcFinancialPercent(payment);
    }

    payment.showQuantityDays = false;

    let eventList = [EventTypeEnum.AUTORIZACAO_DE_FATURAMENTO_BANCARIO, EventTypeEnum.CHECK_IN, EventTypeEnum.CHECK_OUT];
    let searchParameter = eventList.find(e => e == payment.event.value) ? true : false;
    if (searchParameter) {
      let parameter;
      if (payment.event.value == EventTypeEnum.AUTORIZACAO_DE_FATURAMENTO_BANCARIO) {
        parameter = 'PROPOSAL_PAYMENT_INVOICE_DAYS';
      }
      if (payment.event.value == EventTypeEnum.CHECK_IN) {
        parameter = 'PROPOSAL_PAYMENT_CHECKIN_DAYS';
      }
      if (payment.event.value == EventTypeEnum.CHECK_OUT) {
        parameter = 'PROPOSAL_PAYMENT_CHECKOUT_DAYS';
      }

      this.parameterService.searchByName(parameter).subscribe(data => {
        payment.quantityDays = payment.quantityDays != null ? payment.quantityDays : Number(data[0].value);
        this.parameterQuantityDays = Number(data[0].value);
      });
      payment.showQuantityDays = true;
    }
  }

  setModelYear() {
    let value = this.proposal.proposalDetailVehicle.modelYear;
    if (value && value.toString().length == 4
      && this.proposal.proposalDetailVehicle) {
      this.proposal.proposalDetailVehicle.modelYear = value;
      this.loadProductByModel();
    }
  }

  getKeyProductItem(type: any, key: any) {
    return `${type}${key}`;
  }

  addProductItemRegister() {

    let error = '';
    if (!this.proposalItemSelected) {
      error = 'Selecione um item para adicionar!';
    } else if (!this.proposalItemsDisabled && !this.productItemRegister.proposalItem) {
      error = 'Selecione uma configuração do item!';
    } else if (!this.productItemRegister.price) {
      error = 'Preço do produto não pode ser vazio!';
    } else if (!this.productItemRegister.forFree && !this.productItemRegister.finalPrice) {
      error = 'Preço final do produto não pode ser vazio!';
    } else if (!this.productItemRegister.forFree && this.productItemRegister.finalPrice < 0) {
      error = 'Preço final do produto é inválido!';
    }

    else if (this.proposalItemSelected) {
      if (!this.proposalItemSelected.itemType.mandatory && !this.proposalItemSelected.itemType.multi) {
        let itemAdds = this.productItemProposalList.filter(x => x.itemType
          && x.itemType.id == this.proposalItemSelected.itemType.id
          && x.mandatory.value != MandatoryEnum.required);

        if (itemAdds.length) {
          this.confirmationService.confirm({
            message: `Já existe um item desse tipo na proposta, deseja substituir pelo novo item selecionado?`,
            header: 'Substituir item',
            acceptLabel: 'Substituir',
            rejectLabel: 'Cancelar',
            accept: () => {
              _.remove(this.productItemProposalList, x => {
                return x.key == itemAdds[0].key
              });
              this.addProductItemRegisterInList();
            }
          });
        } else {
          this.addProductItemRegisterInList();
        }
      } else if (!error) {
        this.addProductItemRegisterInList();
      } else {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Warn', detail: error });
      }
    }
    //Force
    this.addProposalPayment();

    this.buildProposalDays(true);
  }

  addProductItemRegisterInList() {
    let amountDiscount = 0;
    if (this.productItemRegister.amountDiscount) {
      amountDiscount = this.productItemRegister.amountDiscount;
    }
    this.productItemRegister = Object.assign(this.productItemRegister, this.proposalItemSelected);
    this.productItemRegister.old = !this.proposalItemsDisabled
      ? _.cloneDeep(this.productItemRegister.proposalItem)
      : this.productItemRegister.item;
    this.productItemRegister.canForFree = this.productItemRegister.old.forFree;

    this.productItemRegister.amountDiscount = amountDiscount;

    this.productItemProposalList.push(this.productItemRegister);
    this.buildProductItemList();
    this.buildProposalOutput();

    this.productItemRegister = new ProposalProductItemDTO();
  }

  removeProductItem(index: number, item: ProposalProductItemDTO) {
    this.confirmationService.confirm({
      message: `Deseja realmente remover este item?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (item.itemType.mandatory) {
          if (item.itemType.multi) {
            let outer = this.productItemProposalList.filter(i =>
              i.itemType
              && i.itemType.id == item.itemType.id
              && i.key != item.key
            );

            if (!outer.length) {
              this.messageService.add({
                key: 'tst', severity: 'warn', summary: 'Erro',
                detail: 'Este Item não pode ser removido, pois a proposta exige pelo menos um item desse tipo.'
              });
            } else {
              this.removeProductItemInList(index);
            }
          } else {
            this.messageService.add({
              key: 'tst', severity: 'warn', summary: 'Erro',
              detail: 'Este Item é obrigatório e não pode ser removido.'
            });
          }
        } else {
          this.removeProductItemInList(index);
        }
      }
    });
  }

  removeProductItemInList(index: number) {
    this.productItemProposalList.splice(index, 1);
    this.calSumTotal();
    this.buildProposalDetailVehicleItem();
    this.buildProductItemList();
  }

  removeProposalPayment(key: number) {
    this.confirmationService.confirm({
      message: `Deseja remover este pagamento?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.proposal.proposalPayment.splice(key, 1);
        this.updateProposalPaymentPositions();
      }
    });
  }

  calcFinalPrice(amountDiscount, item: ProposalProductItemDTO) {
    let finalPrice = item.price - amountDiscount;
    item.finalPrice = finalPrice >= 0 ? finalPrice : 0;
    item.amountDiscount = amountDiscount || 0;
    this.buildProposalOutput();
  }

  calcAmountDiscount(finalPrice, item: ProposalProductItemDTO) {
    let amountDiscount = item.price - finalPrice;
    item.amountDiscount = amountDiscount >= 0 ? amountDiscount : 0;
    item.finalPrice = finalPrice || 0;
    this.buildProposalOutput();
  }

  calSumTotal(value?, attribute?: string) {
    if (value && attribute) {
      this.proposal.proposalDetailVehicle[attribute] = value;
    }

    if (this.proposal.immediateDelivery) {
      this.proposal.proposalDetailVehicle.overPrice = 0;
    }

    this.proposalTotal.productPrice = 0;
    this.proposalTotal.productFinalPrice = 0;
    this.proposalTotal.productAmountDiscount = 0;

    this.productItemProposalList.map(item => {
      this.proposalTotal.productPrice += (item.price || 0);
      this.proposalTotal.productAmountDiscount += (item.amountDiscount || 0);
    });
    this.proposalTotal.productFinalPrice += this.proposalTotal.productPrice - this.proposalTotal.productAmountDiscount;

    this.proposal.proposalDetailVehicle.totalAmount = this.proposalTotal.productFinalPrice || 0;
    this.proposal.proposalDetailVehicle.totalAmount += this.proposal.proposalDetailVehicle.overPrice || 0;
    this.proposal.proposalDetailVehicle.totalAmount -= this.proposal.proposalDetailVehicle.overPricePartnerDiscountAmount || 0;
    this.proposal.proposalDetailVehicle.totalAmount -= this.proposal.proposalDetailVehicle.priceDiscountAmount || 0;

    this.calcTotalTaxAmount();
    this.recalcProposalPayment();
  }

  calcTotalTaxAmount(value?, payment?: ProposalPayment) {
    if (value && payment) {
      payment.interest = value;
    }

    this.proposal.proposalDetailVehicle.totalTaxAmount = 0;
    this.proposal.proposalPayment?.map(payment => {
      this.proposal.proposalDetailVehicle.totalTaxAmount += (payment.interest || 0);
    });

    this.totalOpicionais = this.proposalTotal.productPrice - this.productItemProposalList[0]?.price;

    if (this.proposal.proposalDetailVehicle.totalTaxAmount >= 0) {

      this.totalBlindagemSemOpicionais = (this.productItemProposalList[0]?.finalPrice) +
        (this.proposal.proposalDetailVehicle.totalTaxAmount) +
        (this.proposal.proposalDetailVehicle.overPrice) + (this.proposal.proposalDetailVehicle.productAmountDiscount || 0);


      this.totalDesconto = (

        (this.proposalTotal.productAmountDiscount || 0) +
        (this.proposal.proposalDetailVehicle.overPricePartnerDiscountAmount || 0) +
        (this.proposal.proposalDetailVehicle.priceDiscountAmount)

      )


    } else {

      this.totalBlindagemSemOpicionais = (this.productItemProposalList[0]?.finalPrice) +
        (this.proposal.proposalDetailVehicle.overPrice);

      this.totalDesconto = (

        (this.proposalTotal.productAmountDiscount || 0) +
        (this.proposal.proposalDetailVehicle.overPricePartnerDiscountAmount || 0) +
        (this.proposal.proposalDetailVehicle.priceDiscountAmount) +
        (this.proposal.proposalDetailVehicle.totalTaxAmount * -1)

      );

    }
    this.total = this.proposal.proposalDetailVehicle.totalAmount + this.proposal.proposalDetailVehicle.totalTaxAmount;
  }

  recalcProposalPayment() {
    let total = (this.proposal.proposalDetailVehicle.totalAmount || 0)
    if (this.proposal.proposalPayment) {
      this.proposal.proposalPayment.forEach(payment => {
        payment.paymentAmount = _.round(total / 100 * payment.paymentPercent, 2);
        if (payment.paymentAmount && payment.paymentRule?.installments) {
          payment.installmentAmount = payment.paymentAmount / payment.paymentRule.installments;

          if (payment.paymentRule.tax >= 0) {
            payment.installmentAmount = (this.PMT(payment.paymentRule.tax / 100, payment.paymentRule.installments, payment.paymentAmount, 0, 0) * -1);
            payment.interest = (payment.installmentAmount * payment.paymentRule.installments) - payment.paymentAmount;
          } else {
            payment.installmentAmount = ((payment.paymentAmount / payment.paymentRule.installments) * (1 + (payment.paymentRule.tax / 100)));
            payment.interest = (payment.installmentAmount * payment.paymentRule.installments) - payment.paymentAmount;
          }
          this.proposal.proposalPayment.map((todo, i) => {
            if (todo.position == payment.position) {
              this.proposal.proposalPayment[i] = payment;
            }
          });
        }
      });
    }
  }

  calcFinancialPercent(payment: ProposalPayment) {
    let total = this.proposal.proposalDetailVehicle.totalAmount || 0.0;
    payment.paymentPercent = _.round(payment.paymentAmount / total * 100, 1);
    if (Number.isNaN(payment.paymentPercent)) {
      payment.paymentPercent = 100.0;
    }
    this.calcInstallmentAmount(payment.paymentRule, payment, payment.paymentAmount);
  }

  calcFinancialAmount(payment: ProposalPayment) {
    let total = this.proposal.proposalDetailVehicle.totalAmount || 0;
    payment.paymentAmount = _.round(total / 100 * payment.paymentPercent, 2);
    this.calcInstallmentAmount(payment.paymentRule, payment, _.round(total / 100 * payment.paymentPercent, 2));
  }

  calcInstallmentAmount(value, payment: ProposalPayment, paymentAmount?: number) {
    if (payment.installmentsList != undefined) {
      let tmpPayment = payment.installmentsList.find(p => p.id == payment.paymentRule.id);
      payment.preApproved = tmpPayment.preApproved;
    }

    this.proposal.proposalDetailVehicle.totalTaxAmount = 0;
    payment.paymentRule = value;
    payment.installmentAmount = 0;
    payment.interest = 0;

    if (paymentAmount >= 0) payment.paymentAmount = paymentAmount;


    if (payment.paymentAmount && payment.paymentRule?.installments) {
      if (payment.paymentRule.tax >= 0) {
        payment.installmentAmount = (this.PMT(payment.paymentRule.tax / 100, payment.paymentRule.installments, payment.paymentAmount, 0, 0) * -1);
        payment.interest = (payment.installmentAmount * payment.paymentRule.installments) - payment.paymentAmount;
      } else {
        payment.installmentAmount = ((payment.paymentAmount / payment.paymentRule.installments) * (1 + (payment.paymentRule.tax / 100)));
        payment.interest = (payment.installmentAmount * payment.paymentRule.installments) - payment.paymentAmount;
      }
      this.calcTotalTaxAmount();
    }

    if (value) {
      payment.showPaymentPreApproved = true;
    }
  }

  convertItemModelToVehicleItem(itemModel: ProposalItemModel) {
    let vehicleItem = new ProposalDetailVehicleItem();
    vehicleItem.finalPrice = itemModel.price;
    vehicleItem.forFree = itemModel.forFree;
    vehicleItem.amountDiscount = 0;
    vehicleItem.percentDiscount = 0;

    if (itemModel.pciId) {
      let itemPrice = new PriceItem();
      itemPrice.id = itemModel.pciId;
      itemPrice.price = itemModel.price;
      vehicleItem.itemPrice = itemPrice;
      vehicleItem.itemPrice.item = new Item();
      vehicleItem.itemPrice.item.id = itemModel.itmId;
      vehicleItem.itemPrice.item.mandatory = itemModel.mandatory;
      vehicleItem.itemPrice.item.itemType = itemModel.itemType;
      vehicleItem.itemPrice.item.term = itemModel.term;
      vehicleItem.itemPrice.item.termWorkDay = itemModel.termWorkDay;

    } else if (itemModel.pimId) {
      let itemPriceModel = new PriceItemModel();
      itemPriceModel.id = itemModel.pimId;
      itemPriceModel.price = itemModel.price;
      vehicleItem.itemPriceModel = itemPriceModel;
      vehicleItem.itemPriceModel.item = new Item();
      vehicleItem.itemPriceModel.item.id = itemModel.itmId;
      vehicleItem.itemPriceModel.item.mandatory = itemModel.mandatory;
      vehicleItem.itemPriceModel.item.itemType = itemModel.itemType;
      vehicleItem.itemPriceModel.item.term = itemModel.term;
      vehicleItem.itemPriceModel.item.termWorkDay = itemModel.termWorkDay;
    }
    return vehicleItem;
  }

  convertItemToProposalItemModel(vehItem: ProposalDetailVehicleItem) {
    let itemModel = new ProposalItemModel();
    let item = vehItem.itemPrice ? vehItem.itemPrice.item : vehItem.itemPriceModel.item;
    itemModel = new ProposalItemModel();

    if (vehItem.itemPrice) {
      itemModel.pciId = vehItem.itemPrice.id;
      itemModel.prlId = vehItem.itemPrice.priceList?.id;
    } else {
      itemModel.pimId = vehItem.itemPriceModel.id;
      itemModel.prlId = vehItem.itemPriceModel.priceList?.id;
    }

    itemModel.itmId = item.id;
    itemModel.nameItem = item.name;
    itemModel.cod = item.cod;
    itemModel.forFree = item.forFree;
    // itemModel.price = item.price;
    itemModel.mandatory = item.mandatory;
    itemModel.ittId = item.itemType.id;
    return itemModel;
  }

  // payments
  addProposalPayment(isNew?: boolean) {
    if (this.proposal.id && !isNew && this.proposal.proposalPayment.length > 0) {

      this.proposal.proposalPayment.forEach(p => {
        p.showPaymentPreApproved = true;
      })
      return
    } else if (this.proposal.id && isNew && this.proposal.proposalPayment.length > 0) {
      let payment = new ProposalPayment();
      payment.position = this.proposal.proposalPayment.length;
      payment.preApproved = false;
      payment.antecipatedBilling = false;
      payment.carbonBilling = false;
      payment.payer = this.payerTypeList?.find(p => p.value?.toUpperCase() == PayerTypeEnum.CONSUMER);
      payment.event = this.eventTypeList?.find(e => e.value?.toUpperCase() == EventTypeEnum.FIXED_DATE);
      payment.paymentAmount = this.proposal.proposalDetailVehicle.totalAmount - this.proposal.proposalPayment.reduce((accumulator, value) => {
        return accumulator + (value.paymentAmount ? value.paymentAmount : 0.0);
      }, 0.0);

      payment.showPaymentPreApproved = false;

      this.proposal.proposalPayment.push(payment);
      this.calcFinancialPercent(payment);
      this.changeEventType(payment);
    } else if (!this.proposal.id && !isNew && this.proposal.proposalPayment.length > 0) {
      this.proposal.proposalPayment = [];
      let payment = new ProposalPayment();
      payment.position = this.proposal.proposalPayment.length;
      payment.preApproved = null;
      payment.antecipatedBilling = false;
      payment.carbonBilling = false;
      payment.payer = this.payerTypeList?.find(p => p.value?.toUpperCase() == PayerTypeEnum.CONSUMER);
      payment.event = this.eventTypeList?.find(e => e.value?.toUpperCase() == EventTypeEnum.FIXED_DATE);
      payment.paymentAmount = this.proposal.proposalDetailVehicle.totalAmount - this.proposal.proposalPayment.reduce((accumulator, value) => {
        return accumulator + (value.paymentAmount ? value.paymentAmount : 0.0);
      }, 0.0);
      payment.showPaymentPreApproved = false;
      this.proposal.proposalPayment.push(payment);
      this.calcFinancialPercent(payment);
      this.changeEventType(payment);
    } else {
      let payment = new ProposalPayment();
      payment.dueDate = null;
      payment.position = this.proposal.proposalPayment.length;
      payment.preApproved = null;
      payment.antecipatedBilling = false;
      payment.carbonBilling = false;
      payment.payer = this.payerTypeList?.find(p => p.value?.toUpperCase() == PayerTypeEnum.CONSUMER);
      payment.event = this.eventTypeList?.find(e => e.value?.toUpperCase() == EventTypeEnum.FIXED_DATE);
      payment.paymentAmount = this.proposal.proposalDetailVehicle.totalAmount - this.proposal.proposalPayment.reduce((accumulator, value) => {
        return accumulator + (value.paymentAmount ? value.paymentAmount : 0.0);
      }, 0.0);
      payment.showPaymentPreApproved = false;
      this.proposal.proposalPayment.push(payment);
      this.calcFinancialPercent(payment);
      this.changeEventType(payment);
    }
  }

  // loads
  loadModelList(loadModel?: boolean) {
    if (this.proposal.proposalDetailVehicle.model.brand.id) {
      this.modelService.getAllByBrand(this.proposal.proposalDetailVehicle.model.brand.id)
        .pipe(first()).subscribe(data => {
          this.modelList = data ? data : [];
          if (this.proposal.proposalDetailVehicle.model.id && loadModel) {
            this.loadProductByModel();
          }
        });
    }
  }

  loadPartnerByExecutive() {

    if (this.proposal.proposalDetail?.channel?.id && this.proposal.proposalDetail?.seller?.id) {

      let channelId = this.proposal.proposalDetail?.channel?.id;
      let sellerId = this.proposal.proposalDetail?.seller?.id;
      this.idChannelOld = channelId;
      this.proposalFormService.getPartnerByChannelAndSeller(channelId, sellerId).pipe(first()).subscribe(data => {

        this.partnerList = data ? data : [];
        this.partnerShowFirstSelected = false;

        if (this.partnerList.length == 1) {
          this.proposal.proposalDetail.partner = this.partnerList[0];
          this.partnerShowFirstSelected = true;
        }
        this.loadBrandByPartner();
      });
    } else {
      this.partnerList = [];
    }

  }

  loadExecutiveList() {
    this.proposalFormService.getExecutiveList().pipe(first()).subscribe(data => {
      this.executiveList = data ? data : [];
      this.executiveList.sort((a, b) => (a.person.name < b.person.name ? -1 : 1));

      if (!this.proposal?.proposalDetail?.seller?.id) {

        if (this.executiveList.length == 1) {
          this.proposal.proposalDetail.seller = this.executiveList[0];
        } else {
          let executive = this.executiveList.find(e => e?.user?.id == this.app.getCurrentUser.id);
          if (executive) {
            this.proposal.proposalDetail.seller = executive;
          }
        }
      }
    });
  }

  loadSeller() {
    this.proposalFormService.getSellerList().pipe(first()).subscribe(data => {
      this.sellerList = data ? data : [];
      if (this.sellerList.length == 1) {
        this.proposal.proposalDetail.internSale = this.sellerList[0];
      } else {
        let seller = this.sellerList.find(e => e?.user?.id == this.app.getCurrentUser.id);
        if (seller) {
          this.proposal.proposalDetail.internSale = seller;
        }
      }
    });
  }

  loadBrandByPartner() {

    if (this.proposal.proposalDetail && this.proposal.proposalDetail.partner && this.proposal.proposalDetail.partner.id) {
      let ptnId = this.proposal.proposalDetail.channel.hasPartner ? this.proposal.proposalDetail.partner.id : null;
      let chnId = this.proposal.proposalDetail.channel.id;

      this.proposalFormService.getBrandByPartner(ptnId, chnId).pipe(first()).subscribe(data => {
        this.brandList = data ? data : [];
        if (this.brandList.length == 1) {
          this.proposal.proposalDetailVehicle.model.brand = this.brandList[0];
          this.loadModelList();
        }
      });
    } else {

      this.proposalFormService.getBrandByPartner(null, this.proposal.proposalDetail.channel.id).pipe(first()).subscribe(data => {
        this.brandList = data ? data : [];
        if (this.brandList.length == 1) {
          this.proposal.proposalDetailVehicle.model.brand = this.brandList[0];
          this.loadModelList();
        }
      });
    }
  }

  loadProductByModel(initial?: boolean) {
    let ptnId = this.proposal.proposalDetail.partner ? this.proposal.proposalDetail.partner.id : null;
    let chnId = this.proposal.proposalDetail.channel.id === undefined ? null : this.proposal.proposalDetail.channel.id;

    if (this.proposal.proposalDetailVehicle.model.id && this.proposal.proposalDetailVehicle.modelYear) {
      this.proposalFormService.getProductByModelV1(this.proposal.proposalDetailVehicle.model.id, this.proposal.proposalDetailVehicle.modelYear, ptnId, chnId)
        .pipe(first()).subscribe(data => {
          this.productList = data ? data : [];
          if (this.productList.length == 1 && !initial) {
            this.proposal.proposalDetailVehicle.priceProduct.productModel.product = this.productList[0];
            this.loadProductItens();
          }
          if (!this.proposal.id) {
            this.proposal.proposalDetailVehicle.overPrice = this.proposal.proposalDetailVehicle.priceProduct.productModel.product.over_parceiro || 0;
          }
        });
    }
  }

  loadProductItens(initial?: boolean) {

    this.resetProductItemProposalList(initial);

    if (this.proposal.proposalDetail.channel.hasPartner && !this.proposal.proposalDetail.partner) {
      this.messageService.add({
        key: 'tst', severity: 'warn', summary: 'Erro',
        detail: 'Selecione o parceiro para listar os itens para a proposta!'
      });
      return false;
    }

    let productItemModel = new ProposalProductItemFormDTO();
    productItemModel.prdId = this.proposal.proposalDetailVehicle.priceProduct.productModel.product.id;
    productItemModel.chnId = this.proposal.proposalDetail.channel.id;
    productItemModel.ptnId = this.proposal.proposalDetail.partner?.id;
    productItemModel.mdlId = this.proposal.proposalDetailVehicle.model.id;
    productItemModel.brdId = this.proposal.proposalDetailVehicle.model.brand.id;
    productItemModel.year = this.proposal.proposalDetailVehicle.modelYear;
    productItemModel.prlId = this.proposal.proposalDetailVehicle.priceProduct.productModel.product.prlId;

    if (!productItemModel.prlId) {
      productItemModel.prlId = this.proposal.proposalDetailVehicle.priceProduct.priceList.id
    }

    this.proposalFormService.getListProductItems(productItemModel).pipe(first()).subscribe(data => {
      this.proposalFormProduct = data;
      this.proposal.proposalDetailVehicleItem = initial ? this.proposal.proposalDetailVehicleItem : [];
      this.proposal.proposalDetailVehicle.priceProduct.id = data.proposalProduct.pprId;

      this.buildProductItemListAll(data);
      initial && this.buildProductItemListProposal(data); // build product item table list
      !initial && this.buildProposalProduct(data);
      !initial && this.buildProductItemListRequired(); // build product requireds in table list
      this.buildProductItemList();
      this.buildProposalDays(true);
      this.calSumTotal();
      if (initial) {
        this.addProposalPayment(false);
      } else {
        this.addProposalPayment(true);
      }


    }, error => {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Erro', detail: error });
    });
  }

  async loadPayerTypeList() {
    try {
      this.payerTypeList = await this.classifierService.searchByType(ClassifierEnum.PROPOSAL_PAYER_TYPE).toPromise();
    } catch (error) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    }
  }

  async loadEventTypeList() {
    try {
      this.eventTypeList = await this.classifierService.searchByType(ClassifierEnum.EVENT_TYPE).toPromise();
    } catch (error) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    }
  }

  loadItemMandatoryList() {
    this.classifierService.searchByType(ClassifierEnum.ITEM_MANDATORY).pipe(first()).subscribe(data => {
      this.itemMandatoryList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadValidPlate() {
    let plate = this.proposal.proposalDetailVehicle.vehicle.plate;
    if (plate && plate.length == 7) {
      this.vehicleService.search(plate).pipe(first()).subscribe(data => {
        if (data.length > 0) {
          this.confirmationService.confirm({
            message: `Já existe um veículo cadastrado com essa placa, deseja adicioná-lo na proposta?`,
            header: 'Adicionar Veículo na Proposta',
            acceptLabel: 'Adicionar',
            rejectLabel: 'Cancelar',
            accept: () => {
              this.proposal.proposalDetailVehicle.vehicle = data[0];
              this.proposal.proposalDetailVehicle.version = data[0].version;
              this.proposal.proposalDetailVehicle.vehicle.purchaseDate =
                data[0].purchaseDate ? new Date(data[0].purchaseDate) : null;
            },
            reject: () => {
              this.proposal.proposalDetailVehicle.vehicle.plate = null;
            }
          });
        }
      });
    }
  }

  loadPayerType() {
    let isPartner = this.proposal.proposalPayment.filter(e => e.payer.value == "PARTNER");
    isPartner.length > 0 ? this.loadContract = true : this.loadContract = false;
  }

  loadValidChassi() {
    let chassi: string = this.proposal.proposalDetailVehicle.vehicle.chassi;
    if (chassi && chassi.length) {
      this.vehicleService.getByChassi(chassi).pipe(first()).subscribe(data => {
        if (data && data.id) {
          this.confirmationService.confirm({
            message: `Já existe um veículo cadastrado com esse chassi, deseja adicioná-lo na proposta?`,
            header: 'Adicionar Veículo na Proposta',
            acceptLabel: 'Adicionar',
            rejectLabel: 'Cancelar',
            accept: () => {
              this.proposal.proposalDetailVehicle.vehicle = data;
              this.proposal.proposalDetailVehicle.version = data.version;
              this.proposal.proposalDetailVehicle.vehicle.purchaseDate = data.purchaseDate ? new Date(data.purchaseDate) : null;
            },
            reject: () => {
              this.proposal.proposalDetailVehicle.vehicle.chassi = null;
            }
          });
        }
      }, error => {
        this.proposal.proposalDetailVehicle.vehicle.id = null;
      });
    }
  }

  //COMPORTAMENTO DO CAMPO MEIO DE PAGAMENTO:
  //
  //Por padrão a lista de Meios de Pagamento só deve exibir os itens ativos
  //Quando carregamos uma proposta com um Meio de Pagamento inativo, devemos exibir esse meio de pagamento na lista sem a opção de seleção e com indicativo de inativo
  //Foi criada uma lista para armazenar todos os valores da tabela (inclusive os inativos)
  //O metodo resetPaymentMethodList filtra os itens ativos
  loadPaymentMethod() {
    this.paymentMethodService.getAll().pipe(first()).subscribe(data => {
      this.paymentMethodOriginalList = data;
      this.resetPaymentMethodList();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetPaymentMethodList() {
    if (this.paymentMethodOriginalList) {
      this.paymentMethodOriginalList.forEach(item => {
        this.checkPaymentMethodList();

        //Caso o Meio de Pagamento esteja inativo e não exista na lista, adiciona o item inativo na lista e ordena
        if (item.active && !this.paymentMethodList.some(data => data.id == item.id)) {
          this.paymentMethodList.push(item);
          this.paymentMethodList.sort((a, b) => (a.name < b.name ? -1 : 1));
        }
      });
    }
  }

  loadInstallmentsList(paymentMethod: PaymentMethod, payment: ProposalPayment) {
    this.checkPaymentMethodList();

    //Caso o Meio de Pagamento esteja inativo e não exista na lista, adiciona o item inativo na lista e ordena
    if (paymentMethod && !paymentMethod.active && !this.paymentMethodList.some(data => data.id == paymentMethod.id)) {
      this.paymentMethodList.push(paymentMethod);
      this.paymentMethodList.sort((a, b) => (a.name < b.name ? -1 : 1));
    }

    this.paymentRuleService.getByPaymentType(paymentMethod).pipe(first()).subscribe(data => {
      payment.installmentsList = PaymentRuleUtil.buildList(data);
      if (payment.installmentsList?.length <= 0) {
        payment.installmentAmount = payment.paymentAmount;
      }

      // Caso houver parcela e a mesma estiver inativa adiciona na lista para proposta existente
      if (payment.paymentRule) {
        let tmpPaymentRule = payment.installmentsList.find(i => i.id == payment.paymentRule.id);
        payment.installmentsList = payment.installmentsList.filter(data => data.active == true);
        payment.installmentsList.push(tmpPaymentRule);
      } else {
        payment.installmentsList = payment.installmentsList.filter(data => data.active == true);
      }
      payment.installmentsList.sort((a, b) => (a.installments < b.installments ? -1 : 1));

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  checkPaymentMethodList() {
    //Esse metodo foi necessário pois quando editamos uma proposta, de forma assincrona a lista de Meios de Pagamento ainda esta sendo carregada
    if (!this.paymentMethodList) {
      this.paymentMethodList = new Array<PaymentMethod>();
      setTimeout(() => {
        this.proposal = JSON.parse(JSON.stringify(this.proposal))
        this.proposal.proposalPayment?.forEach(p => {
          p.dueDate = new Date(p.dueDate);
        })
        this.resetPaymentMethodList();
        this.buildPayment();
      }, 1000)
    }
  }

  onClick(active: boolean) {
    //Metodo que desabilita o click
    if (!active) {
      event.stopPropagation();
    }
  }

  async loadProposalPaymentMainDays() {
    let parameters = await this.parameterService.searchByName('PROPOSAL_PAYMENT_MAIN_DAYS').toPromise();
    this.proposalPaymentMainDays = parameters?.length > 0 ? +parameters[0].value : 30;
    this.proposalMinDueDate = new Date();
    this.proposalMaxDueDate = new Date(this.proposalMinDueDate);
    this.proposalMaxDueDate.setDate(this.proposalMinDueDate.getDate() + this.proposalPaymentMainDays);
  }

  updateProposalPaymentPositions() {
    if (this.proposal?.proposalPayment) {
      this.proposal.proposalPayment.sort((a, b) => {
        if (a.position > b.position) {
          return 1;
        }
        if (a.position < b.position) {
          return -1;
        }
        return 0;
      });

      for (let index = 0; index < this.proposal.proposalPayment.length; index++) {
        this.proposal.proposalPayment[index].position = this.proposal.proposalPayment[index].position >= 0 ? this.proposal.proposalPayment[index].position : index;
      }
    }
  }

  PMT(rate, nperiod, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv) / nperiod;

    var pvif = Math.pow(1 + rate, nperiod);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
      pmt /= (1 + rate);
    };

    return pmt;
  }

  loadColorList() {
    this.classifierService.searchByType(ClassifierEnum.VEHICLE_COLOR).pipe(first()).subscribe(data => {
      this.colorList = data;
      this.colorList.sort((a, b) => (a.label < b.label ? -1 : 1));
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  validationDays(payment) {
    if (payment.quantityDays < this.parameterQuantityDays) {
      this.messageService.add({
        key: 'tst', severity: 'warn', summary: 'Erro',
        detail: 'A quantidade de dias, deve ser maior que ' + this.parameterQuantityDays + '!'
      });
      return false;
    }
  }
}
