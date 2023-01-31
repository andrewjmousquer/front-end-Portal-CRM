import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import { FromToMinMax } from 'src/app/shared/enum/from-to-enum';
import { Brand } from 'src/app/shared/model/brand.model';
import { Model } from 'src/app/shared/model/model.model';
import { ProductModel } from 'src/app/shared/model/product-model.model';
import { ProductModelCost } from 'src/app/shared/model/product.model.cost';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProductModelService } from 'src/app/shared/service/product-model.service';
import { UserUtil } from 'src/app/shared/util/user.util';
import { Utils } from 'src/app/shared/util/util';
import { BrandFormService } from '../../brand-form/brand-form.service';
import { ModelFormService } from '../../model-form/model-form.service';
import { ProductModelCostDuplicateMultipleComponent } from '../product-model-cost-duplicate-multiple/product-model-cost-duplicate-multiple.component';
import { ProductModelCostDuplicateSingleComponent } from '../product-model-cost-duplicate-single/product-model-cost-duplicate-single.component';
import { ProductModelCostUpdatePeriodsComponent } from '../product-model-cost-update-periods/product-model-cost-update-periods.component';
import { ProductModelCostUpdateValuesComponent } from '../product-model-cost-update-values/product-model-cost-update-values.component';
import { ProductModelCostService } from './../service/product-model-cost.service';

@Component({
  selector: 'portal-product-model-cost-form',
  templateUrl: './product-model-cost-form.component.html',
  styleUrls: ['./product-model-cost-form.component.css']
})
export class ProductModelCostFormComponent implements OnInit {

  // Variáveis Para A Tela De Cadastro
  productModelCostRegister: ProductModelCost = new ProductModelCost();

  productModelList: ProductModel[];
  productModelRegister: ProductModel = new ProductModel();

  productModelYearList: ProductModel[];
  productModelYearRegister:  ProductModel = new ProductModel();

  brandList: Brand[];
  brandRegister: Brand = new Brand();

  modelList: Model[] = Array<Model>();
  modelRegister: Model = new Model();

  userUtil: any = UserUtil;

  // Variáveis Para A Tela De Pesquisa
  selectedProducModelCost: ProductModelCost[];

  productModelCostSearchList: ProductModelCost[];
  productModelCostSearch: ProductModelCost = new ProductModelCost();

  brandSearchList: Brand[];
  brandSearch: Brand = new Brand();

  modelSearchList: Model[] = Array<Model>();
  modelSearch: Model = new Model();

  productModelSearchList: ProductModel[];
  productModelSearch: ProductModel = new ProductModel();

  // Variáveis Para O p-Table
  isEdit = false;
  cols: any[];

  // DynamicDialog - Duplicate Single
  refDuplicateSingle: DynamicDialogRef;

  // DynamicDialog - Duplicate Multiple
  refDuplicateMultiple: DynamicDialogRef;

  // DynamicDialog - Update Values
  refUpdateValues: DynamicDialogRef;

  // DynamicDialog - Update Periods
  refUpdatePeriods: DynamicDialogRef;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('productModelCostRegisterForm', {
    static: false
  }) productModelCostRegisterForm: NgForm;
  @Output() onComplete: EventEmitter<Proposal> = new EventEmitter();
  @Output() getProposalInitCustom: EventEmitter<Proposal> = new EventEmitter();

  constructor(
    private messageService: MessageService,
    private brandService: BrandFormService,
    private modelService: ModelFormService,
    private confirmationService: ConfirmationService,
    private productModelService: ProductModelService,
    private productModelCostService: ProductModelCostService,
    public dialogService: DialogService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'productModel.model.brand.name', header: 'Marca' },
      { field: 'productModel.model.name', header: 'Modelo' },
      { field: 'productModel.product.name', header: 'Produto' },
      { field: 'productModel.modelYearText', header: 'Faixa Ano Modelo' },
      { field: 'startDateEndDateText', header: 'Período' },
      { field: 'totalValue', header: 'Total' }
    ];

    this.productModelCostSearchList = new Array<ProductModelCost>();
    this.brandList = new Array<Brand>();

    this.loadBrandList();
    this.resetSearchForm();
  }

  ngOnDestroy() {
    if (this.refDuplicateSingle) {
        this.refDuplicateSingle.close();
    }

    if (this.refDuplicateMultiple) {
      this.refDuplicateMultiple.close();
    }

    if (this.refUpdateValues) {
      this.refUpdateValues.close();
    }
  }

  resetSearchForm() {
    this.loadProductModelCost();

    this.brandSearch = new Brand();
    this.brandSearchList = new Array<Brand>();

    this.modelSearch = new Model();

    this.productModelSearch = new ProductModel();
    this.productModelSearchList = new Array<ProductModel>();
    
    this.productModelCostSearch = new ProductModelCost();
  }

  // Métodos Usados Na Tela De Pesquisa
  changeBrandSearch() {
    this.loadModelSearchList();
  }

  loadModelSearchList() {
    this.modelService.getAllByBrand(this.brandSearch.id).pipe(first()).subscribe(data => {
      this.modelSearchList = data ? data : [];
    })
  }

  changeModelSearch() {
    this.loadProductModelSearchList();
  }

  loadProductModelSearchList() {

    this.productModelSearch = new ProductModel();

    this.productModelSearch.model = this.modelSearch;
    this.productModelSearch.hasProject = true;

    this.productModelService.search(this.productModelSearch).pipe(first()).subscribe(data => {
      this.productModelSearchList = data ? data : [];
    });
  }

  // Métodos Usados Na Tela De Cadastro
  changeBrand() {
    this.loadModelList();
  }

  loadModelList() {
    this.modelService.getAllByBrand(this.brandRegister.id).pipe(first()).subscribe(data => {
      this.modelList = data ? data : [];
    });
  }

  changeModel() {
    this.loadProductModelList();
  }

  loadProductModelList() {

    this.productModelList = new Array<ProductModel>();

    this.productModelRegister = new ProductModel();

    this.productModelRegister.model = this.modelRegister;
    this.productModelRegister.hasProject = true;

    this.productModelService.search(this.productModelRegister).pipe(first()).subscribe(data => {
      this.productModelList = data ? data : [];
    });
  }

  changeProductModel() {
    this.loadProductModelYearList();
  }

  loadProductModelYearList() {

    this.productModelRegister.model = this.modelRegister;
    this.productModelRegister.product = this.productModelRegister.product;
    this.productModelRegister.hasProject = true;

    this.productModelService.search(this.productModelRegister).pipe(first()).subscribe(data => {
      this.productModelYearList = data.map(item => {
        
        if (item.modelYearStart != FromToMinMax.MIN_YEAR && item.modelYearEnd == FromToMinMax.MAX_YEAR) {
          item.modelYearText = `À Partir de ${item.modelYearStart}`;
        } else if (item.modelYearStart == FromToMinMax.MIN_YEAR && item.modelYearEnd != FromToMinMax.MAX_YEAR) {
          item.modelYearText = `Até ${item.modelYearEnd}`;
        } else if (item.modelYearStart != FromToMinMax.MIN_YEAR && item.modelYearEnd != FromToMinMax.MAX_YEAR) {
          item.modelYearText = `De ${item.modelYearStart} até ${item.modelYearEnd}`;
        } else if (item.modelYearStart == FromToMinMax.MIN_YEAR && item.modelYearEnd == FromToMinMax.MAX_YEAR) {
          item.modelYearText = 'Todos';
        }

        return {
          ...item
        }
      });
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  // Métodos Usados Na Tela De Pesquisa E Cadastro
  loadBrandList() {
    this.brandSearch.active = true;
    this.brandService.search(this.brandSearch).pipe(first()).subscribe(data => {
      this.brandSearchList = data ? data : [];
      this.brandList = data ? data : [];
    });
  }

  loadProductModelCost() {
    this.productModelCostService.getAll().pipe(first()).subscribe(data => {
      this.productModelCostSearchList = data.map(item => {
        
        item.startDateEndDateText = this.datePipe.transform(item.startDate, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(item.endDate, 'dd/MM/yyyy');
        
        if (item.productModel.modelYearStart != FromToMinMax.MIN_YEAR && item.productModel.modelYearEnd == FromToMinMax.MAX_YEAR) {
          item.productModel.modelYearText = `À Partir de ${item.productModel.modelYearStart}`;
        } else if (item.productModel.modelYearStart == FromToMinMax.MIN_YEAR && item.productModel.modelYearEnd != FromToMinMax.MAX_YEAR) {
          item.productModel.modelYearText = `Até ${item.productModel.modelYearEnd}`;
        } else if (item.productModel.modelYearStart != FromToMinMax.MIN_YEAR && item.productModel.modelYearEnd != FromToMinMax.MAX_YEAR) {
          item.productModel.modelYearText = `De ${item.productModel.modelYearStart} até ${item.productModel.modelYearEnd}`;
        } else if (item.productModel.modelYearStart == FromToMinMax.MIN_YEAR && item.productModel.modelYearEnd == FromToMinMax.MAX_YEAR) {
          item.productModel.modelYearText = 'Todos';
        }

        return {
          ...item
        }
      });
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  save() {

    let method = this.productModelCostRegister.id ? 'update' : 'save';
    let message = this.productModelCostRegister.id ? 'atualizado' : 'adicionado';

    this.productModelCostRegister.productModel = this.productModelRegister;

    this.productModelCostService[method](this.productModelCostRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });
      this.productModelCostRegisterForm.reset();
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  onSelectionChange(event) {
    this.selectedProducModelCost = event;
  }

  edit (event) {

    this.productModelCostRegister = event.data;
      
    this.isEdit = true;
    
    this.productModelCostService.getById(this.productModelCostRegister.id).pipe(first()).subscribe(data => {

      data.startDate = Utils.normalizeDate(this.productModelCostRegister.startDate );
      data.endDate = Utils.normalizeDate(this.productModelCostRegister.endDate );

      this.productModelCostRegister = data;

      this.loadBrandList();

      this.brandRegister = this.productModelCostRegister.productModel.model.brand;
      this.loadModelList();

      this.modelRegister = this.productModelCostRegister.productModel.model;
      this.changeModel();

      this.productModelRegister = this.productModelCostRegister.productModel;
      this.changeProductModel();

      this.productModelYearRegister = this.productModelCostRegister.productModel;

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.isEdit = false;

    this.productModelList = new Array<ProductModel>();
    this.productModelRegister = new ProductModel();
  
    this.productModelYearList = new Array<ProductModel>();
    this.productModelYearRegister = new ProductModel();
  
    this.brandList = new Array<Brand>();
    this.brandRegister = new Brand();
  
    this.modelList = new Array<Model>();
    this.modelRegister = new Model();
    
    this.productModelCostRegister = new ProductModelCost();
    this.productModelCostRegisterForm.form.reset();

    this.loadBrandList();
  }

  search(event) {

    if (event && event.first) {
      this.brandSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.brandSearch.first = 0;
    }

    let method = null;

    if (this.brandSearch.name == null &&
        this.modelSearch.name == null &&
        this.productModelSearch.product == null &&
        this.productModelCostSearch.startDate == null && this.productModelCostSearch.endDate == null ) {

      method = 'getAll';
    } else {
      method = 'find';
    }

    this.productModelCostSearch.productModel = new ProductModel();
    this.productModelCostSearch.productModel.model = new Model();
    this.productModelCostSearch.productModel.model.brand = new Brand();
    this.productModelCostSearch.productModel.hasProject = true;

    if (this.brandSearch != null && this.brandSearch.id != null) {
      this.productModelCostSearch.productModel.model.brand = this.brandSearch;
    }

    if (this.modelSearch != null && this.modelSearch.id != null) {
      this.productModelCostSearch.productModel.model = this.modelSearch;
    }

    if (this.productModelSearch != null && this.productModelSearch.id != null) {
      this.productModelCostSearch.productModel = this.productModelSearch;
    }

    this.productModelCostService[method](this.productModelCostSearch).pipe(first()).subscribe(data => {
      this.productModelCostSearchList = data.map(item => {
        
        item.startDateEndDateText = this.datePipe.transform(item.startDate, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(item.endDate, 'dd/MM/yyyy');
        item.productModel.modelYearText = 'DE ' + item.productModel.modelYearStart.toString() + ' ATÉ ' + item.productModel.modelYearEnd.toString()
        
        return {
          ...item
        }
      })
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(productModelCost: ProductModelCost) {
    this.confirmationService.confirm({
      message: `Deseja remover ${productModelCost.productModel.model.brand.name} ${productModelCost.productModel.model.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.productModelCostService.delete(productModelCost.id).pipe(first()).subscribe(data => {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
            this.resetSearchForm();
            this.productModelCostRegisterForm.reset();
            this.loadProductModelCost();
          }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
          });
      }
    })
  }

  duplicateSingle(productModelCosts: ProductModelCost) {

    this.refDuplicateSingle = this.dialogService.open(ProductModelCostDuplicateSingleComponent, {
      header: 'Duplicar',
      width: '80%',
      height: '80%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      closable: true,
      data: productModelCosts
    });

    this.refDuplicateSingle.onClose.subscribe((productModelCost: ProductModelCost) => {
      if (productModelCost) {
        this.messageService.add({key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      } else if (productModelCost != undefined){
        this.messageService.add({key: 'tst', severity: 'error', summary: 'Erro', detail: `Já existe um relacionamento com esse produto e modelo, dentro do mesmo range de ano/modelo e período!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      }
    });
  }

  duplicateMultiple(productModelCost: ProductModelCost[]) {

    this.refDuplicateMultiple = this.dialogService.open(ProductModelCostDuplicateMultipleComponent, {
      header: 'Duplicar',
      width: '80%',
      height: '80%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      closable: true,
      data: productModelCost
    });

    this.refDuplicateMultiple.onClose.subscribe((productModelCosts: ProductModelCost[]) => {

      if (productModelCosts) {
        this.messageService.add({key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registros adicionados com sucesso!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      } else if (productModelCosts != undefined){
        this.messageService.add({key: 'tst', severity: 'error', summary: 'Erro', detail: `Já existe um relacionamento com esse produto e modelo, dentro do mesmo range de ano/modelo e período!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      }
    });
  }

  updateValues(productModelCost: ProductModelCost[]) {

    this.refUpdateValues = this.dialogService.open(ProductModelCostUpdateValuesComponent, {
      header: 'Editar Valores',
      width: '30%',
      height: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      closable: true,
      data: productModelCost
    });

    this.refUpdateValues.onClose.subscribe((productModelCosts: ProductModelCost[]) => {

      if (productModelCosts != null && productModelCosts.length > 0) {
        this.messageService.add({key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registros atualizados com sucesso!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      } else if (productModelCosts != undefined){
        this.messageService.add({key: 'tst', severity: 'error', summary: 'Erro', detail: `Já existe um relacionamento com esse produto e modelo, dentro do mesmo range de ano/modelo e período!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      }
    });
  }

  updatePeriods(productModelCost: ProductModelCost[]) {

    this.refUpdatePeriods = this.dialogService.open(ProductModelCostUpdatePeriodsComponent, {
      header: 'Editar Períodos',
      width: '80%',
      height: '80%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      closable: true,
      data: productModelCost
    });

    this.refUpdatePeriods.onClose.subscribe((productModelCosts: ProductModelCost[]) => {

      if (productModelCosts != null && productModelCosts.length > 0) {
        this.messageService.add({key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registros adicionados com sucesso!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      } else if (productModelCosts != undefined){
        this.messageService.add({key: 'tst', severity: 'error', summary: 'Erro', detail: `Já existe um relacionamento com esse produto e modelo, dentro do mesmo range de ano/modelo e período!`});
        this.productModelCostRegisterForm.reset();
        this.resetSearchForm();
        this.resetRegisterForm();
      }
    });
  }
}