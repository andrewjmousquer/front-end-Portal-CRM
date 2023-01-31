import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { ConfirmationService, MessageService } from "primeng/api";
import { first } from "rxjs/operators";

import { BodyTypeDictionary } from "src/app/shared/dictionary/body-type.dictionary";
import { CategoryDictionary } from "src/app/shared/dictionary/category.dictionary";
import { SizeDictionary } from "src/app/shared/dictionary/size.dictionary";
import { Brand } from "src/app/shared/model/brand.model";
import { Classifier } from "src/app/shared/model/classifier.model";
import { Model } from "src/app/shared/model/model.model";
import { ProductModel } from "src/app/shared/model/product-model.model";
import { BrandFormService } from "../brand-form/brand-form.service";
import { ModelFormService } from "./model-form.service";

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html'
})
export class ModelFormComponent implements OnInit {

  isEdit: boolean = false;

  cols: any[];
  colsProduct: any[];
  formSearch: any;

  brand: Brand;
  brandName: string;
  brandList: Brand[];
  brandRegister: Brand;
  codFipe: string;

  brandSearch: Brand = new Brand();

  modelList: Model[];
  modelSearch: Model;
  modelRegister: Model;
  modelProduct: ProductModel;

  categoryList: Classifier[];
  bodyTypeList: Classifier[];
  sizeList: Classifier[];

  categoriaRegister: any;

  selectedCategory: Classifier;
  selectedBodyType: Classifier;
  selectedSize: Classifier;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('modelRegisterForm', { static: false }) modelRegisterForm: NgForm;

  constructor(
    protected route: ActivatedRoute,
    private brandService: BrandFormService,
    private messageService: MessageService,
    private modelFormService: ModelFormService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.cols = [
      { field: 'brand.name', header: 'Marca', width: '120px' },
      { field: 'name', header: 'Modelo' },
      { field: 'active', header: 'Situação' },
    ];

    this.colsProduct = [
      { field: 'name', header: 'Produto' },
      { field: 'project', header: 'Projeto' },
      { field: 'prazo', header: 'Prazo' },
      { field: 'anomodelo', header: 'Ano Modelo' },
    ];

    this.brand = new Brand();
    this.brandRegister = new Brand();
    this.modelRegister = new Model();

    this.modelList = new Array<Model>();
    this.brandList = new Array<Brand>();

    this.categoryList = CategoryDictionary;
    this.bodyTypeList = BodyTypeDictionary;
    this.sizeList = SizeDictionary;

    this.loadBrandList();
    this.resetSearchForm();
    this.resetRegisterForm();
  }

  resetSearchForm() {
    this.loadModel();
    this.modelSearch = new Model();
  }

  resetRegisterForm() {
    this.modelRegisterForm && this.modelRegisterForm.reset();

    this.isEdit = false;
    this.brandRegister = new Brand();
    this.modelRegister = new Model();
    this.modelSearch = new Model();
  }

  loadBrandList() {
    this.brandSearch.active=true;
    this.brandService.search(this.brandSearch).pipe(first()).subscribe(data => {
      this.brandList = data ? data : [];
      this.brandList.sort((b1, b2) =>  b1.name.localeCompare(b2.name));
    });
  }

  loadModel() {
    this.modelFormService.getAll().pipe(first()).subscribe(data => {
      this.modelList = data
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  search(event) {
    if (event && event.first) {
      this.modelSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.modelSearch.first = 0;
    }
    
    if (this.modelSearch.name) {
      this.modelFormService.search(this.modelSearch).pipe(first()).subscribe(data => {
        this.modelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.modelFormService.getAll().pipe(first()).subscribe(data => {
        this.modelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }


  }

  edit(eventl) {
    this.isEdit = true;
    this.modelFormService.getById(this.modelRegister.id).pipe(first()).subscribe(data => {
      this.modelRegister = data;
      this.brandRegister = data.brand;
      this.codFipe = data.codFipe;
      this.selectedCategory = this.categoryList.filter(item => item.type == this.modelRegister.category)[0];
      this.selectedBodyType = this.bodyTypeList.filter(item => item.type == this.modelRegister.bodyType)[0];
      this.selectedSize = this.sizeList.filter(item => item.type == this.modelRegister.size)[0];
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(Model: Model) {
    this.confirmationService.confirm({
      message: `Deseja remover ${Model.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.modelFormService.delete
          (Model.id).pipe(first()).subscribe(data => {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
            this.resetSearchForm();
            this.resetRegisterForm();
          }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
          });
      }
    })
  }

  save() {
    let method = this.modelRegister.id ? 'update' : 'save';
    let message = this.modelRegister.id ? 'atualizado' : 'adicionado';

    this.modelRegister.category = this.selectedCategory.type;
    this.modelRegister.bodyType = this.selectedBodyType.type;
    this.modelRegister.size = this.selectedSize.type;
    this.modelRegister.brand = this.brandRegister;
    this.modelRegister.codFipe = this.codFipe;

    if (this.modelRegister.active === undefined)
      this.modelRegister.active = false;

    this.modelFormService[method](this.modelRegister).pipe(first()).subscribe(data => {
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
  }

  // produts
  editProduct(event) {

  }
}
