import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from "rxjs/operators";
import { PartnerSituationTypeEnum } from 'src/app/shared/enum/partner-situation-enum';
import { Brand } from 'src/app/shared/model/brand.model';
import { Channel } from 'src/app/shared/model/channel-model';
import { ItemModel } from 'src/app/shared/model/item-model.model';
import { Item } from 'src/app/shared/model/item.model';
import { Model } from 'src/app/shared/model/model.model';
import { PartnerGroup } from 'src/app/shared/model/partner-group.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { PriceList } from 'src/app/shared/model/price-list-model';
import { ProductModel } from 'src/app/shared/model/product-model.model';
import { Product } from 'src/app/shared/model/product.model';
import { ItemModelService } from 'src/app/shared/service/item-model.service';
import { ProductModelService } from 'src/app/shared/service/product-model.service';
import { Utils } from 'src/app/shared/util/util';
import { BrandFormService } from '../brand-form/brand-form.service';
import { ChannelFormService } from '../channel-form/channel-form.service';
import { ItemFormService } from '../item-form/item-form.service';
import { ModelFormService } from '../model-form/model-form.service';
import { PartnerFormService } from '../partner-form/partner-form.service';
import { ItemItemGrid } from './dtos/item-item-grid.model';
import { PriceListAdjustment } from './dtos/price-list-adjustment.model';
import { PriceListDuplicateItem } from './dtos/price-list-duplicate-item.model';
import { PriceListFormSearch } from './dtos/price-list-form-search.model';
import { PriceListForm } from './dtos/price-list-form.model';
import { ProductItemGrid } from './dtos/product-item-grid.model';
import { PriceListFormService } from './price-list-form.service';

@Component({
  selector: 'app-price-list-form',
  templateUrl: './price-list-form.component.html',
  styleUrls: ['./price-list-form.component.css']
})
export class PriceListFormComponent implements OnInit, OnDestroy {

  first = 0;

  searchCols: any[];
  productCols: any[];
  itensCols: any[];
  matchModeOptions: SelectItem[];
  validateInfoMessage: String = '';

  priceListSearch: PriceList;             // Representa o item de busca para o grid
  priceListSearchResult: PriceListFormSearch[];     // Representa a lista com os resultados da busca
  priceListFormModel: PriceListForm;      // Representa o objeto do form, será usado para o save / update
  priceListSelected: PriceList;           // Representa o item selecionado da lista de busca

  // Lista auxiliares
  channelList: Channel[];                 // Representa a lista de canais para ser usada em combo
  partnerGroupList: PartnerGroup[];       // Representa a lista de grupos de parceiro para ser usada em combo
  brandList: Brand[];
  modelListFull: Model[];
  modelListByBrand: Model[];
  $productList: Promise<Product[]>;
  productModelMap: {};
  $productModelList: Promise<ProductModel[]>;

  itemList: Item[];                       // Lista de itens usada em combo
  itemModelListRef: ItemModel[];          // Lista de referência com o resultado da busca do item by model
  itemBrandListTemp: Brand[];             // Lista temporária que armazena os dados de marcas com base na seleção do item
  itemModelListTemp: Model[];             // Lista temporária que armazena os dados de modelos com base na seleção do item e da marca
  itemItemModelListTemp: ItemModel[];     // Lista temporária que armazena os dados de de item by model com base na seleção do item, marca e modelo

  partnerList: Partner[];
  partnerAvailableList: Partner[];        // Representa a lista de parceiros disponíveis para associação

  displayProductFormDialog: boolean;      // Flag de controle para o dialogo de inclusão de um novo produto no GRID
  displayItemFormDialog: boolean;         // Flag de controle para o dialogo de inclusão de um novo item no GRID
  displayAdjustementDialog: boolean;

  // Listas dos GRIDs
  productItemGrid: ProductItemGrid;         // Representa o item da lista no GRID
  priceListProductsList: ProductItemGrid[]; // Representa a lista de elentos que são listados no GRID

  itemItemGrid: ItemItemGrid;
  priceListItensList: ItemItemGrid[];

  editItemMode: boolean = false;
  editProdutcMode: boolean = false;
  editMode: boolean = false;
  hasOverlayTable: boolean = false;

  adjustmentControl: PriceListAdjustment;

  @ViewChild('priceListForm', { static: false }) priceListForm: NgForm;
  @ViewChild('prdDialogForm', { static: false }) prdDialogForm: NgForm;
  @ViewChild('itmDialogForm', { static: false }) itmDialogForm: NgForm;f
  @ViewChild('adjDialogForm', { static: false }) adjDialogForm: NgForm;
  @ViewChild('dtTbProduct', { static: false }) dtTbProduct: Table;
  @ViewChild('dtTbItem', { static: false }) dtTbItem: Table;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(
    private messageService: MessageService,
    private service: PriceListFormService,
    private channelService: ChannelFormService,
    private brandService: BrandFormService,
    private modelService: ModelFormService,
    private productModelService: ProductModelService,
    private itemService: ItemFormService,
    private itemModelService: ItemModelService,
    private partnerService: PartnerFormService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnDestroy(): void {
    this.messageService?.clear();
    this.resetRegisterForm();
    this.resetSearchForm();
  }

  ngOnInit(): void {

    this.searchCols = [
      { field: 'priceList.name', header: 'Nome' },
      { field: 'priceList.channel.name', header: 'Canal' },
      { field: 'priceList.start', header: 'Data Início' },
      { field: 'priceList.end', header: 'Data FIm' },
      { field: 'qtdPartners', header: 'Parceiros' }
    ];

    this.productCols = [
      { field: 'alert', header: '', width: '3%', filterEnabled: false },
      { field: 'brand', header: 'Marca', width: '13%', search: "brand.name", filterEnabled: true },
      { field: 'model', header: 'Modelo', width: '13%', search: "model.name", filterEnabled: true },
      { field: 'product', header: 'Produto', width: '13%', search: "product.name", filterEnabled: true },
      { field: 'modelYear', header: 'Ano Modelo', width: '13%', filterEnabled: true, filterType: "text", search: "formatedModelYear" },
      { field: 'hasProject', header: 'Projeto', width: '7%', search: "productModel.hasProject", filterEnabled: true, filterType: "boolean" },
      { field: 'dueDays', header: 'Prazo', width: '12%', search: "productModel.manufactureDays", filterEnabled: true, filterType: "numeric" },
      { field: 'price', header: 'Preço', width: '14%', search: "price", filterEnabled: true, filterType: "numeric" },
      { field: 'btnEdit', header: '', width: '12%', filterEnabled: false }
    ];

    this.itensCols = [
      { field: 'alert', header: '', width: '3%', filterEnabled: false },
      { field: 'item', header: 'Item', width: '13%', search: "item.name", filterEnabled: true },
      { field: 'type', header: 'Tipo', width: '13%', search: "item.itemType.name", filterEnabled: true },
      { field: 'generic', header: 'Todos os modelos', width: '11%', search: "item.generic", filterEnabled: true, filterType: "boolean" },
      { field: 'brand', header: 'Marca', width: '12%', search: "brand.name", filterEnabled: true },
      { field: 'model', header: 'Modelo', width: '13%', search: "model.name", filterEnabled: true },
      { field: 'modelYear', header: 'Ano modelo', width: '13%', filterEnabled: true },
      { field: 'price', header: 'Preço', width: '12%', search: "price", filterEnabled: true, filterType: "numeric" },
      { field: 'btnEdit', header: '', width: '10%', filterEnabled: false }
    ];

    this.new();

    this.loadChannelList();
    this.loadModelList();
    this.loadBrandList();
    this.loadItemList();
    this.loadPartnerList();
    this.resetSearchForm();
  }

  resetSearchForm() {
    this.priceListSearch = new PriceList();
    this.search(this.priceListSearch);
  }

  resetRegisterForm() {
    if (this.priceListForm) {
      this.priceListForm.form.reset();
    }

    this.itemModelListRef = [];
    this.priceListSelected = new PriceList();
    this.editMode = false;
    this.hasOverlayTable = false;
    this.priceListProductsList = [];
    this.productItemGrid = new ProductItemGrid();
    this.priceListItensList = [];
    this.itemItemGrid = new ItemItemGrid();
    this.displayProductFormDialog = false;
    this.displayItemFormDialog = false;
    this.displayAdjustementDialog = false;
    this.priceListFormModel = new PriceListForm();
    this.partnerAvailableList = [];
    this.adjustmentControl = new PriceListAdjustment();
  }

  search(event) {
    if (event && event.first) {
      this.priceListSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.priceListSearch.first = 0;
    }

    this.service.search(this.priceListSearch)
      .pipe(first())
      .subscribe(data => {
        this.priceListSearchResult = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  loadChannelList() {
    let searchChannel = new Channel();
    searchChannel.active = true;

    this.channelService.search(searchChannel)
      .pipe(first())
      .subscribe(data => {
        this.channelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  loadModelList() {
    this.modelService.getAll()
      .pipe(first())
      .subscribe(data => {
        this.modelListFull = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  loadPartnerList() {
    // FIXME está comentado pois a controller está muito ruim não permite
    // Buscas padrões de entidade, vou fazer o filtro em tela
    this.partnerService.getAll()
      .pipe(first())
      .subscribe(data => {
        this.partnerList = data.filter(item => item.situation.value == PartnerSituationTypeEnum.active);
        this.partnerAvailableList = [... this.partnerList];
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  changeChannel() {
    if (!this.priceListFormModel.priceList.channel?.hasPartner) {
      this.priceListFormModel.priceList.allPartners = false;

    } else {
      this.partnerAvailableList = [...this.partnerList.filter(item => item.situation.value == PartnerSituationTypeEnum.active && item.channel.id === this.priceListFormModel?.priceList?.channel?.id)];
    }
  }

  setDuplicateErrorMessage(item, name: String) {
    this.hasOverlayTable = true;

    if (item) {
      item.error = true;
      item.errorMsg = "<b>Nome da tabela:</b></br> " + name;
    }
  }

  /*
   * Limpa a lista de seleção ao mudar o switch
   */
  public changeFlagAllPartners() {
    this.priceListFormModel.partners = [];
    this.partnerAvailableList = [...this.partnerList.filter(item => item.channel.id === this.priceListFormModel?.priceList?.channel?.id)];
  }

  /**
   * Utils
   */
  randomId() {
    return (Math.random() + new Date().getUTCMilliseconds()) * -1;
  }

  formatModelYear(start, end) {
    return Utils.formatModelYear(start, end);
  }

  /**
   * AJUSTE DE PREÇOS
   */
  listAdjustProducts() {
    if (this.priceListProductsList) {
      for (let item in this.priceListProductsList) {
        if (this.adjustmentControl.products.findIndex(prd => prd.id == this.priceListProductsList[item].product.id) <= -1) {
          this.adjustmentControl.products.push(this.priceListProductsList[item].product);
        }
      }
    }
  }

  closeAdjustmentDialog() {
    this.adjDialogForm.form.reset();
    this.displayAdjustementDialog = false;
    this.adjustmentControl = new PriceListAdjustment();
  }

  adjustmentAction() {
    if (this.adjustmentControl.action == "reset") {
      this.adjustmentControl.change = "monetary";
    }
  }

  adjustmentType() {
    if (this.adjustmentControl.change == "monetary") {
      this.adjustmentControl.percentValue = null;
    } else {
      this.adjustmentControl.monetaryValue = null;
    }
  }

  applyAdjustment() {
    let negativeZeroValue = this.checkAjustment();
    if (negativeZeroValue) {
      this.confirmationService.confirm({
        message: `Com o ajuste aplicado alguns produtos ficarão com o valor ZERO ou NEGATIVO, deseja continuar?`,
        header: 'Ajustar preço do produto',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.processAjustment();
          this.closeAdjustmentDialog();
        }
      });

    } else {
      this.processAjustment();
      this.closeAdjustmentDialog();
    }
  }

  checkAjustment() {
    for (let index in this.priceListProductsList) {
      let item = this.priceListProductsList[index];

      if (item.product.id === this.adjustmentControl.product.id) {
        let tmpPrice = this.applyAdjusmentValue(item.price);

        if (tmpPrice <= 0) {
          return true;
        }
      }
    }

    return false;
  }

  processAjustment() {
    for (let index in this.priceListProductsList) {
      let item = this.priceListProductsList[index];

      if (item.product.id === this.adjustmentControl.product.id) {
        item.price = this.applyAdjusmentValue(item.price);
      }
    }
  }

  applyAdjusmentValue(tmpPrice) {
    if (this.adjustmentControl.action == "reset") {
      return this.adjustmentControl.monetaryValue;

    } else if (this.adjustmentControl.action == "adjust") {
      if (this.adjustmentControl.change == "monetary") {
        tmpPrice += this.adjustmentControl.monetaryValue;
      } else {
        tmpPrice += (tmpPrice * (this.adjustmentControl.percentValue / 100));
      }

      return tmpPrice;
    }

    return null;
  }

  validSaveForm() {
    if (this.priceListForm) {

      this.validateInfoMessage = 'Salvar';

      // Validação dos inputfields padrões REQUIRED
      if (!this.priceListForm.form.valid) {
        this.showMessage('Verifique os campos obrigatórios');
        return this.priceListForm.form.valid;
      }

      // Válida se existe algum parceiro selecionado, somente no caso de não ser TODOS OS PARCEIROS e/ou o canal não contenha parceiro
      if ((this.priceListFormModel.priceList.channel?.hasPartner && !this.priceListFormModel.priceList.allPartners) &&
        (!this.priceListFormModel.partners || this.priceListFormModel.partners.length == 0)) {
        this.showMessage('Adicione pelo menos 1 parceiro');
        return false;
      }

      // Não é permitido salvar sem um item ou produto selecionado
      if ((!this.priceListProductsList || this.priceListProductsList.length == 0) && (!this.priceListItensList || this.priceListItensList.length == 0)) {
        this.showMessage('Adicione pelo menos 1 produto ou 1 item');
        return false;
      }
    }

    return true;
  }

  save() {
    if (!this.validSaveForm()) { return; };

    this.priceListFormModel.products = this.priceListProductsList.map(item => {
      return item.toPriceProduct();
    });

    this.priceListFormModel.itens = this.priceListItensList.filter(item => item.item.generic)
      .map(item => {
        return item.toPriceItem();
      });

    this.priceListFormModel.itensModel = this.priceListItensList.filter(item => !item.item.generic)
      .map(item => {
        return item.toPriceItemModel();
      });

    if (this.priceListFormModel.priceList.allPartners == null) {
      this.priceListFormModel.priceList.allPartners = false;
    }

    this.service.checkDuplicateItens(this.priceListFormModel).pipe(first()).subscribe(data => {

      if (data && data.length > 0) {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Aviso', detail: "Não é possível criar a tabela devido a sobreposição entre produtos e/ou itens em uma tabela já existente. Verifique os itens marcados." });

        for (let index in data) {

          let dataItem: PriceListDuplicateItem = data[index];

          if (dataItem.productModelId) {
            let searchGridRow = new ProductItemGrid();
            searchGridRow.productModel = new ProductModel();
            searchGridRow.productModel.id = dataItem.productModelId;

            let found = this.findDuplicateProductItem(searchGridRow);
            this.setDuplicateErrorMessage(found, dataItem.priceList.name);
          }

          if (dataItem.itemId && dataItem.itemModelId == null) {
            let searchGridRow = new ItemItemGrid();
            searchGridRow.item = new Item();
            searchGridRow.item.id = dataItem.itemId;

            let found = this.findDuplicateItem(searchGridRow);
            this.setDuplicateErrorMessage(found, dataItem.priceList.name);
          }

          if (dataItem.itemModelId != null) {
            let searchGridRow = new ItemItemGrid();

            if (dataItem.itemModelId > 0) {
              searchGridRow.itemModel = new ItemModel();
              searchGridRow.itemModel.id = dataItem.itemModelId;
            }

            if (dataItem.brandId > 0) {
              searchGridRow.brand = new Brand();
              searchGridRow.brand.id = dataItem.brandId;
            }

            searchGridRow.item = new Item();
            searchGridRow.item.id = dataItem.itemId;

            searchGridRow.allBrands = dataItem.allBrands;
            searchGridRow.allModels = dataItem.allModels;

            let found = this.findDuplicateItem(searchGridRow);
            this.setDuplicateErrorMessage(found, dataItem.priceList.name);
          }
        }

      } else {
        this.hasOverlayTable = false;
        this.saveForm(this.priceListFormModel);
      }

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  saveForm(form: PriceListForm) {
    if (!this.hasOverlayTable) {
      let method = this.editMode ? 'update' : 'save';
      let message = this.editMode ? 'atualizado' : 'adicionado';

      this.service[method](form).pipe(first()).subscribe(data => {

        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Salvo com sucesso',
          detail: `Registro ${message} com sucesso!`
        });

        this.resetSearchForm();
        this.resetRegisterForm();
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Não é possível criar a tabela pois o formulário contém erros." });
    }
  }

  new() {
    this.resetRegisterForm();
  }

  edit(event) {
    this.resetRegisterForm();

    this.service.getById(event.data.priceList.id)
      .pipe(first())
      .subscribe(data => {
        this.editMode = true;

        let prcList: PriceList = data.priceList;
        prcList.start = new Date(data.priceList.start);
        prcList.end = new Date(data.priceList.end);

        this.priceListFormModel.priceList = prcList;
        this.priceListFormModel = data;

        if (data.products && data.products.length > 0) {
          for (let index in data.products) {
            this.priceListProductsList.push(ProductItemGrid.toGridItem(data.products[index]));
          }
        }

        if (data.itens && data.itens.length > 0) {
          for (let index in data.itens) {
            this.priceListItensList.push(ItemItemGrid.toGridItem(data.itens[index]));
          }
        }

        if (data.itensModel && data.itensModel.length > 0) {
          for (let index in data.itensModel) {
            this.priceListItensList.push(ItemItemGrid.toGridItemModel(data.itensModel[index]));
          }
        }

        if (data.partners && data.partners.length > 0) {
          this.partnerAvailableList = this.partnerList;
          this.partnerAvailableList = this.partnerAvailableList.filter(item => {
            return !data.partners.some(item2 => {
              return item.id === item2.id;
            });
          });
        }

        this.dtTbProduct.reset();
        this.dtTbItem.reset();
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  delete() {
    if (this.priceListFormModel != null && this.priceListFormModel.priceList.id) {

      let msg = this.priceListFormModel.priceList.name;

      this.confirmationService.confirm({
        message: `Deseja remover a lista de preço <strong>` + msg + `</strong> ?`,
        header: 'Remover lista de preço',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        accept: () => {

          this.service.delete(this.priceListFormModel.priceList.id)
            .pipe(first())
            .subscribe(data => {
              this.messageService.add({
                key: 'tst',
                severity: 'info',
                summary: 'Removido com Sucesso!',
                detail: 'Registro removido com sucesso!'
              });

              this.resetSearchForm();
              this.resetRegisterForm();

            }, error => {
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
            });

        }
      });

    } else {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Aviso', detail: "Selecione uma lista para ser excluída." });
    }
  }

  duplicate() {
    let temp: PriceListForm = Utils.deepCopy<PriceListForm>(this.priceListFormModel);

    this.resetRegisterForm();

    let prcList: PriceList = temp.priceList;
    prcList.id = null;
    prcList.name = null;
    prcList.start = null;
    prcList.end = null;

    this.priceListFormModel.priceList = prcList;

    if (temp.products && temp.products.length > 0) {
      for (let index in temp.products) {
        temp.products[index].id = this.randomId();
        temp.products[index].priceList = null;

        this.priceListProductsList.push(ProductItemGrid.toGridItem(temp.products[index]));
      }
    }

    // reset itens
    if (temp.itens && temp.itens.length > 0) {
      for (let index in temp.itens) {
        temp.itens[index].id = this.randomId();
        temp.itens[index].priceList = null;

        this.priceListItensList.push(ItemItemGrid.toGridItem(temp.itens[index]));
      }
    }

    if (temp.itensModel && temp.itensModel.length > 0) {
      for (let index in temp.itensModel) {
        temp.itensModel[index].id = this.randomId();
        temp.itensModel[index].priceList = null;

        this.priceListItensList.push(ItemItemGrid.toGridItemModel(temp.itensModel[index]));
      }
    }

    if (temp.partners && temp.partners.length > 0) {
      this.partnerAvailableList = [... this.partnerList.filter(item => item.channel.id === this.priceListFormModel?.priceList?.channel?.id)];
      this.partnerAvailableList = this.partnerAvailableList.filter(item => {
        return !temp.partners.some(item2 => {
          return item.id === item2.id;
        });
      });
    } else {
      temp.partners = [];
    }


    this.priceListFormModel = Utils.deepCopy<PriceListForm>(temp);
  }



  /**
   * PRODUTO - Operações do popup e GRID
   */
  closeProductDialog() {
    this.displayProductFormDialog = false;
    this.productItemGrid = new ProductItemGrid();
    this.prdDialogForm.form.reset();
    this.modelListByBrand = [];
    this.$productModelList = Promise.resolve([]);
    this.$productList = Promise.resolve([]);
    this.dtTbProduct.first = this.first;
    this.dtTbProduct._first = this.first;
    this.productModelMap = {};
    this.editProdutcMode = false;
    this.priceListProductsList = [...this.priceListProductsList]
    this.dtTbProduct.first = this.first;
    this.dtTbProduct._first = this.first;
  }

  changePage(event){
    this.first = event.first;
  }

  resetPage(){
    this.first = 0;
  }
  
  saveProductItem() {
    if (this.findDuplicateProductItem(this.productItemGrid)) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Aviso', detail: "Este produto já existe na lista." });

    } else {

      if (this.productItemGrid.id) {
        this.productItemGrid.formatedModelYear = this.formatModelYear(this.productItemGrid?.productModel?.modelYearStart, this.productItemGrid?.productModel?.modelYearEnd);
        this.priceListProductsList[this.findProductItemById(this.productItemGrid.id)] = this.productItemGrid;

      } else {
        this.productItemGrid.id = this.randomId();
        this.productItemGrid.formatedModelYear = this.formatModelYear(this.productItemGrid?.productModel?.modelYearStart, this.productItemGrid?.productModel?.modelYearEnd);
        this.priceListProductsList.push(this.productItemGrid);
      }

      this.closeProductDialog();
    }
  }

  editProductItem(item: ProductItemGrid) {
    this.productItemGrid = { ...item };
    this.editProdutcMode = true;

    this.loadModelListByBrand(this.productItemGrid.brand, true);

    this.displayProductFormDialog = true;
  }

  deleteProductItem(item: ProductItemGrid) {
    let msg = item.brand.name + " / " +
      item.model.name + " / " +
      item.product.name + " / " +
      "De " + item.productModel.modelYearStart + " até " + item.productModel.modelYearEnd + " / " +
      "R$ " + item.price;

    this.confirmationService.confirm({
      message: `Deseja remover o item <strong>` + msg + `</strong> da lista ?`,
      header: 'Remover registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.priceListProductsList = this.priceListProductsList.filter(rowItem => rowItem.id !== item.id);
      }
    })
  }

  findDuplicateProductItem(searchedItem: ProductItemGrid) {
    let item = this.priceListProductsList.find(item => item.productModel.id === searchedItem.productModel.id);
    if (item == null || (this.editProdutcMode && item.id === searchedItem.id)) {
      return null;
    }
    return item;
  }

  findProductItemById(id: number) {
    let index = this.priceListProductsList.findIndex(item => item.id == id);
    return index;
  }

  loadBrandList() {
    let searchBrand = new Brand();
    searchBrand.active = true;

    this.brandService.search(searchBrand)
      .pipe(first())
      .subscribe(data => {
        this.brandList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  loadModelListByBrand(brand: Brand, edit: Boolean = false) {
    if (!edit) {
      this.productItemGrid.model = null;
      this.productItemGrid.product = null;
      this.productItemGrid.productModel = null;
    }

    this.productModelMap = {};
    this.$productModelList = Promise.resolve([]);

    let searchModel = new Model();
    searchModel.active = true;
    searchModel.brand = brand;

    this.modelService.search(searchModel)
      .pipe(first())
      .subscribe((data) => {
        this.modelListByBrand = data;

        if (edit) {
          this.loadProductListByModel(this.productItemGrid.model, edit);
        }

      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  loadProductListByModel(model: Model, edit: Boolean = false) {
    if (!edit) {
      this.productItemGrid.product = null;
      this.productItemGrid.productModel = null;
    }

    this.productModelMap = {};
    this.$productModelList = Promise.resolve([]);

    let searchProduct = new Product();
    searchProduct.active = true;

    let searchProductModel = new ProductModel();
    searchProductModel.model = model;
    searchProductModel.product = searchProduct;
    searchProductModel.hasProject = null;

    this.productModelService.search(searchProductModel)
      .pipe(first())
      .subscribe((data) => {
        this.parseProductModelList(data);

        if (edit) {
          this.loadProductModelList(this.productItemGrid.product, edit);
        }

      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  // Processa o retorno para transformar em lista de modelo e produto
  parseProductModelList(productModelList: ProductModel[]) {
    let productList = [];

    this.productModelMap = productModelList.reduce((result, currentValue) => {
      if (currentValue.product.active) {
        if (productList.findIndex(item => item.id == currentValue.product.id) == -1) {
          productList.push(currentValue.product);
        }
        const key = currentValue.product.id;
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(currentValue);
        return result;
      }
    }, {});

    this.$productList = Promise.resolve(productList);
  }

  loadProductModelList(product: Product, edit: Boolean = false) {
    this.$productModelList = Promise.resolve(this.productModelMap[product.id]);
  }

  /**
   * ITEM - Operações do popup e GRID
   */
  closeItemDialog() {
    this.displayItemFormDialog = false;
    this.itemItemGrid = new ItemItemGrid();
    this.itmDialogForm.form.reset();
    this.itemBrandListTemp = [];
    this.itemModelListTemp = [];
    this.itemItemModelListTemp = [];
    this.editItemMode = false;
    this.dtTbItem.reset();
  }

  loadItemList() {
    this.itemService.getAll()
      .pipe(first())
      .subscribe(data => {
        this.itemList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  /**
   * Carrega a lista de modelos associados ao item
   * selecionado.
   */
  loadModelListByItem() {
    if (!this.editItemMode) {
      this.itemItemGrid.brand = null;
      this.itemItemGrid.model = null;
      this.itemItemGrid.itemModel = null;
      this.itemItemGrid.allBrands = false;
      this.itemItemGrid.allModels = false;

    } else if (this.itemItemGrid.item.generic) {
      this.itemItemGrid.allBrands = false;
      this.itemItemGrid.allModels = false;
    }

    this.itemModelListTemp = [];
    this.itemItemModelListTemp = [];

    // Se for genérico nem precisamos consultar os modelos associados.
    if (this.itemItemGrid.item.generic) {
      return;
    }

    let searchModel = new ItemModel();
    searchModel.item = new Item();
    searchModel.item.id = this.itemItemGrid.item.id;

    this.itemModelService.search(searchModel)
      .pipe(first())
      .subscribe(data => {
        this.itemModelListRef = data;
        this.loadItemModelToBrandList();
        this.loadItemModelListByBrand();
        this.loadItemModelListByModel();
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  /**
   * Carrega de forma invertida os fabricantes associados
   * aos modelos do item.
   *
   * Depende da lista de modelos por item 'itemModelListRef'
   */
  loadItemModelToBrandList() {
    this.itemBrandListTemp = [];

    // Não tenta carregar a lista pois se trata de um item genérico que não tem fabricante
    if (this.itemItemGrid && this.itemItemGrid.item && this.itemItemGrid.item.generic) {
      return;
    }

    for (let index in this.itemModelListRef) {
      let model = this.modelListFull.find(model => model.id == this.itemModelListRef[index].model.id);
      if (model) {
        // Cria a lista temporária de marcas do item, tratamento para evitar duplicar
        if (this.itemBrandListTemp.findIndex(i => i.id == model.brand.id) == -1) {
          this.itemBrandListTemp.push(model.brand);
        }
      }
    }
  }

  /**
   * Com base no filtro da fabricante encontramos os modelos associados.
   *
   * Depende da lista de modelos por item 'itemModelListRef'
   */
  loadItemModelListByBrand() {
    if (!this.editItemMode) {
      this.itemItemGrid.model = null;
      this.itemItemGrid.itemModel = null;
      this.itemItemGrid.allBrands = false;
      this.itemItemGrid.allModels = false;
    }

    this.itemItemModelListTemp = [];
    this.itemModelListTemp = [];

    // Não tenta carregar a lista pois se trata de um item genérico que não tem fabricante
    if (this.itemItemGrid && this.itemItemGrid.item && this.itemItemGrid.item.generic) {
      return;
    }

    for (let index in this.itemModelListRef) {
      let model = this.modelListFull.find(model => model.id == this.itemModelListRef[index].model.id &&
        (this.itemItemGrid.allBrands || model.brand?.id == this.itemItemGrid.brand?.id));
      if (model) {
        // Cria a lista temporária de modelos do item, tratamento para evitar duplicar
        if (this.itemModelListTemp.findIndex(i => i.id == model.id) == -1) {
          this.itemModelListTemp.push(model);
        }
      }
    }
  }

  loadItemModelListByModel() {
    this.itemItemModelListTemp = [];

    if (this.itemItemGrid && (this.itemItemGrid.item && this.itemItemGrid.item.generic) || this.itemItemGrid.allModels) {
      return;
    }

    this.itemItemModelListTemp = this.itemModelListRef.filter(itemModel => itemModel.item.id == this.itemItemGrid.item.id &&
      itemModel.model.id == this.itemItemGrid.model?.id);
  }

  changeFlagItemAllBrand() {
    if (this.itemItemGrid.allBrands) {
      this.itemItemGrid.brand = null;
      this.itemItemGrid.model = null;
      this.itemItemGrid.itemModel = null;
      this.itemItemGrid.allModels = true;

    } else {
      this.loadModelListByItem();
      this.itemItemGrid.allModels = false;
    }
  }

  changeFlagItemAllModels() {
    if (this.itemItemGrid.allModels) {
      this.itemItemGrid.model = null;
      this.itemItemGrid.itemModel = null;

    } else {
      this.loadItemModelToBrandList();
    }
  }

  saveItem() {
    if (this.findDuplicateItem(this.itemItemGrid)) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Aviso', detail: "Este item já existe na lista." });

    } else {

      if (this.itemItemGrid.id) {
        this.itemItemGrid.formatedModelYear = this.formatModelYear(this.itemItemGrid?.itemModel?.modelYearStart, this.itemItemGrid?.itemModel?.modelYearEnd);
        this.priceListItensList[this.findItemById(this.itemItemGrid.id)] = this.itemItemGrid;

      } else {
        this.itemItemGrid.id = this.randomId();
        this.itemItemGrid.formatedModelYear = this.formatModelYear(this.itemItemGrid?.itemModel?.modelYearStart, this.itemItemGrid?.itemModel?.modelYearEnd);
        this.priceListItensList.push(this.itemItemGrid);
      }

      this.closeItemDialog();
    }
  }

  deleteItem(item: ItemItemGrid) {

    let msg = "";

    if (item.item.generic) {
      msg = item.item.name + " / " +
        "R$ " + item.price;
    } else {
      msg = (item.allBrands ? 'Todas as marcas' : item.brand.name) + " / " +
        (item.allModels ? 'Todos os modelos' : item.model.name) + " / " +
        item.item.name + " / " +
        "R$ " + item.price;
    }

    this.confirmationService.confirm({
      message: `Deseja remover o item <strong>` + msg + `</strong> da lista ?`,
      header: 'Remover registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.priceListItensList = this.priceListItensList.filter(rowItem => rowItem.id !== item.id);
      }
    })
  }

  editItem(item: ItemItemGrid) {
    this.editItemMode = true;

    this.itemItemGrid = { ...item };
    this.loadModelListByItem();

    this.displayItemFormDialog = true;
  }

  findDuplicateItem(searchedItem: ItemItemGrid) {
    let foundItem = this.priceListItensList.find(item => {
      if (item.item && item.item.generic && item.item.id === searchedItem.item.id) {
        return item;

      } else if (item.itemModel?.id === item.itemModel?.id &&
        item.item.id === searchedItem.item.id &&
        item.allBrands === searchedItem.allBrands &&
        item.allModels === searchedItem.allModels &&
        item.brand?.id === searchedItem.brand?.id) {
        return item
      }

    });

    if (foundItem == null || (this.editItemMode && foundItem.id === searchedItem.id)) {
      return null;
    }

    return foundItem;
  }

  findItemById(id: number) {
    let index = this.priceListItensList.findIndex(item => item.id == id);
    return index;
  }

  showMessage(message: string) {
    this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Aviso', detail: message });
  }
}
