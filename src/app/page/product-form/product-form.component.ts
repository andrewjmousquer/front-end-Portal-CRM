import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { FromToDictionary } from "src/app/shared/dictionary/from-to.dictionary";
import { StatusDictionary } from 'src/app/shared/dictionary/status.dictionary';
import { FromToEnum, FromToMinMax } from "src/app/shared/enum/from-to-enum";
import { Brand } from 'src/app/shared/model/brand.model';
import { Classifier } from "src/app/shared/model/classifier.model";
import { Model } from 'src/app/shared/model/model.model';
import { ProductModel } from 'src/app/shared/model/product-model.model';
import { Status } from 'src/app/shared/model/status.model';
import { Product } from '../../shared/model/product.model';
import { BrandFormService } from '../brand-form/brand-form.service';
import { ModelFormService } from '../model-form/model-form.service';
import { ProductFormService } from './product-form.service';

@Component({
  selector: 'wbp-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {

  isEdit: boolean = false;
  isEditModel: boolean = false;

  cols: any[];
  colsModel: any[];

  productSearch: Product;
  productRegister: Product = new Product();
  productModelRegister: ProductModel = new ProductModel();

  selectedStatus: Status = new Status();
  selectedProductModelBrand: Brand;
  selectedFromTop: Classifier = new Classifier();

  productList: Product[] = new Array<Product>();
  brandList: Brand[];
  modelList: Model[];
  statusList: Status[] = new Array<Status>();
  fromToList: Classifier[] = FromToDictionary;

  fromToEnum: any = FromToEnum;
  fromToMinMax: any = FromToMinMax;

  isValid: boolean = false;

  @ViewChild('productRegisterForm', { static: false }) productRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductFormService,
    private brandService: BrandFormService,
    private modelService: ModelFormService) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'active', header: 'Situação' }
    ];

    this.colsModel = [
      { field: 'model.brand.name', header: 'Marca', search:'brand.name', filterEnabled: true },
      { field: 'model.name', header: 'Modelo', search:'model.name' ,filterEnabled: true },
      { field: 'hasProject', header: 'Projeto', search:'hasProject', filterEnabled: true },
      { field: 'manufactureDays', header: 'Prazo', search:'manufactureDays' ,filterEnabled: true },
      { field: 'modelYearText', header: 'Ano Modelo', search:'modelYearStart' ,filterEnabled: true },
    ];
    this.statusList = StatusDictionary;
    this.loadBrandList();
    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadBrandList() {
    this.brandService.getAll().pipe(first()).subscribe(data => {
      this.brandList = data ? data : [];
    });
  }

  loadModelList() {
    if (this.selectedProductModelBrand) {
      this.modelService.getAllByBrand(this.selectedProductModelBrand.id).pipe(first()).subscribe(data => {
        this.modelList = data ? data : [];
      });
    }
  }

  loadProduct() {
    this.productService.getAll().pipe(first()).subscribe(data => {
      this.productList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadProduct();
    this.productSearch = new Product();
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.productRegister = new Product();
    this.productRegister.models = [];
    this.productRegisterForm && this.productRegisterForm.reset({
      status: this.statusList[0],
    });
    this.resetRegisterModelForm();
  }

  resetRegisterModelForm() {
    this.isEditModel = false;
    this.selectedProductModelBrand = new Brand();
    this.productModelRegister = new ProductModel();
    this.selectedFromTop = new Classifier();

  }

  resetSelectedFromTop() {
    this.productModelRegister.modelYearEnd = null;
    this.productModelRegister.modelYearStart = null;
  }

  search(event) {
    if (event && event.first) {
      this.productSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.productSearch.first = 0;
    }

    this.productService.search(this.productSearch).pipe(first()).subscribe(data => {
      this.productList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(product: Product) {
    this.confirmationService.confirm({
      message: `Deseja remover ${product.name}?`, header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.productService.delete(product.id).pipe(first()).subscribe(data => {
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Removido com Sucesso!',
            detail: 'Registro removido com sucesso!'
          });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({
            key: 'tst', severity: 'error', summary: 'Erro',
            detail: error
          });
        });
      }
    });
  }

  edit(event) {
    this.isEdit = true;
    this.resetRegisterModelForm();
    this.productService.getById(this.productRegister.id).pipe(first()).subscribe(data => {
      this.productRegister = data;
      this.selectedStatus = this.statusList.filter(item => item.code == this.productRegister.active)[0];
      this.productRegister.models = data.models;
      this.valid();
      this.buildTextModelYear();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  // Model
  save() {
    this.productRegister.active = this.selectedStatus.code;
    let method = this.productRegister.id ? 'update' : 'save';
    let message = this.productRegister.id ? 'atualizado' : 'adicionado';

    this.productService[method](this.productRegister).pipe(first()).subscribe(data => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Salvo com sucesso',
        detail: `Registro ${message} com sucesso!`
      });
      this.isValid = false;
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  saveModel() {
    if (!this.productRegister.models) {
      this.productRegister.models = [];
    }
    if (this.isFormModelValid()) {
      let itemModel = Object.assign({}, this.productModelRegister);
      this.setYearMinMaxModel(itemModel);

      if (itemModel.id != null) {
        this.productRegister.models = this.productRegister.models.map(item => {
          return item.id == itemModel.id ? itemModel : item
        });
      } else {
        this.productRegister.models.push(itemModel);
      }

      this.productRegister.models = [...this.productRegister.models];
      this.valid();
      this.resetRegisterModelForm();
      this.buildTextModelYear();
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Informe todos os campos obrigatórios de modelo' });
    }
  }

  removeModel(model: ProductModel) {
    let index = this.productRegister.models.indexOf(model);
    this.productRegister.models.splice(index, 1);

    this.productRegister.models = [...this.productRegister.models];
    this.valid();
  }

  editModel(event) {
    this.isEditModel = true;
    this.productModelRegister = Object.assign({}, this.productModelRegister);

    this.selectedProductModelBrand = this.productModelRegister.model.brand;

    if (this.productModelRegister.modelYearEnd == this.fromToMinMax.MAX_YEAR) {

      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.FROM)[0];
    }

    if (this.productModelRegister.modelYearStart == this.fromToMinMax.MIN_YEAR) {
      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.TO)[0];
    }

    if (this.productModelRegister.modelYearEnd == this.fromToMinMax.MAX_YEAR &&
      this.productModelRegister.modelYearStart == this.fromToMinMax.MIN_YEAR) {

      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.ALL)[0];
    }

    if (this.productModelRegister.modelYearEnd != this.fromToMinMax.MAX_YEAR &&
      this.productModelRegister.modelYearStart != this.fromToMinMax.MIN_YEAR) {

      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.FROMTO)[0];
    }
    if (this.selectedProductModelBrand) {
      this.loadModelList();
    }
  }

  setYearMinMaxModel(itemModel) {
    if (this.selectedFromTop.type == this.fromToEnum.FROM) {
      itemModel.modelYearEnd = this.fromToMinMax.MAX_YEAR;
    }

    if (this.selectedFromTop.type == this.fromToEnum.TO) {
      itemModel.modelYearStart = this.fromToMinMax.MIN_YEAR;
    }

    if (this.selectedFromTop.type == this.fromToEnum.ALL) {
      itemModel.modelYearEnd = this.fromToMinMax.MAX_YEAR;
      itemModel.modelYearStart = this.fromToMinMax.MIN_YEAR;
    }
  }

  isFormModelValid() {
    if (!this.productModelRegister) return false;
    if (!this.productModelRegister.manufactureDays) return false;
    if (!this.selectedFromTop.id) return false;
    if (!this.productModelRegister.model) return false;
    if (this.selectedFromTop.type == this.fromToEnum.FROM && !this.productModelRegister.modelYearStart) {
      return false
    }
    if (this.selectedFromTop.type == this.fromToEnum.TO && !this.productModelRegister.modelYearEnd) {
      return false
    }
    if (this.selectedFromTop.type == this.fromToEnum.FROMTO
      && (!this.productModelRegister.modelYearEnd || !this.productModelRegister.modelYearEnd)) {
      return false
    }
    return true;
  }

  valid() {
    if (this.productRegisterForm.invalid && this.productModelRegister.model === undefined) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  buildTextModelYear() {
    if (this.productRegister.models) {
      this.productRegister.models.map(pm => {
        if (pm.modelYearStart != FromToMinMax.MIN_YEAR && pm.modelYearEnd == FromToMinMax.MAX_YEAR) {
          pm.modelYearText = `À Partir de ${pm.modelYearStart}`;
        } else if (pm.modelYearStart == FromToMinMax.MIN_YEAR && pm.modelYearEnd != FromToMinMax.MAX_YEAR) {
          pm.modelYearText = `Até ${pm.modelYearEnd}`;
        } else if (pm.modelYearStart != FromToMinMax.MIN_YEAR && pm.modelYearEnd != FromToMinMax.MAX_YEAR) {
          pm.modelYearText = `De ${pm.modelYearStart} até ${pm.modelYearEnd}`;
        } else if (pm.modelYearStart == FromToMinMax.MIN_YEAR && pm.modelYearEnd == FromToMinMax.MAX_YEAR) {
          pm.modelYearText = 'Todos';
        }
      });
    }
  }
}
