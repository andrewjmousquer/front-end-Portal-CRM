import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from "@angular/forms";

import { first } from "rxjs/operators";

import { Item } from "src/app/shared/model/item.model";
import { BrandFormService } from "../brand-form/brand-form.service";
import { ItemFormService } from "./item-form.service";

import { ConfirmationService, MessageService } from "primeng/api";
import { FromToDictionary } from "src/app/shared/dictionary/from-to.dictionary";
import { MandatoryDictionary } from "src/app/shared/dictionary/mandatory.dictionary";
import { FromToEnum, FromToMinMax } from "src/app/shared/enum/from-to-enum";
import { Brand } from "src/app/shared/model/brand.model";
import { Classifier } from "src/app/shared/model/classifier.model";
import { ItemModel } from "src/app/shared/model/item-model.model";
import { ItemType } from "src/app/shared/model/itemtype.model";
import { Model } from "src/app/shared/model/model.model";
import { ItemTypeService } from "src/app/shared/service/item-type.service";
import { ModelFormService } from "../model-form/model-form.service";
import { FileUpload } from "primeng/fileupload";
import { ClassifierService } from "src/app/shared/service/classifier.service";
import { ClassifierEnum } from "src/app/shared/enum/classifier-enum";
import { ItemResponsabilityEnum } from "src/app/shared/enum/item-responsability-enum";
import { ThisReceiver } from "@angular/compiler";
import { Parameter } from "src/app/shared/model/parameter.model";
import { ParameterService } from "src/app/shared/service/parameter.service";
import { generalEnvironments } from "src/environments/environment.general";
import { FileUtil } from "src/app/shared/util/file.util";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['item-form.component.css']
})
export class ItemFormComponent implements OnInit {

  isEdit: boolean = false;
  isEditModel: boolean = false;

  cols: any[];
  colsModel: any[];

  itemList: Item[] = new Array<Item>();
  itemSearch: Item;
  itemRegister: Item = new Item();

  itemModelRegister: ItemModel = new ItemModel();

  itemTypeList: ItemType[];

  brandList: Brand[];
  modelList: Model[];
  itemMandatoryList: Classifier[];
  fromToList: Classifier[] = FromToDictionary;
  responsabilityList: Classifier[];

  selectedItemModelBrand: Brand;
  selectedFromTop: Classifier;

  fromToEnum: any = FromToEnum;
  fromToMinMax: any = FromToMinMax;

  maximumBytesFileSize: number = Number(generalEnvironments.maxFileUploadSize);

  itemFile: File;
  itemFileUrl: any;
  itemFileChanged: boolean = false;
  itemFileDeleted: boolean = false;
  @ViewChild('fileArchive') fileArchive: ElementRef;
  
  iconFile: File;
  iconFileUrl: any;
  iconFileChanged: boolean = false;
  iconFileDeleted: boolean = false;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('itemRegisterForm', { static: false }) itemRegisterForm: NgForm;

  constructor(
    private brandService: BrandFormService,
    private itemTypeService: ItemTypeService,
    private classifierService: ClassifierService,
    private modelService: ModelFormService,
    private messageService: MessageService,
    private itemFormService: ItemFormService,
    private confirmationService: ConfirmationService,
    private parameterService: ParameterService,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome', width: '350px' },
      { field: 'itemType.name', header: 'Tipo de Item' },
      { field: 'cod', header: 'Configuração' },
      { field: 'generic', header: 'Genérico' },
    ];

    this.colsModel = [
      { field: 'model.brand.name', header: 'Marca' },
      { field: 'model.name', header: 'Modelo' },
      { field: 'yearModelLabel', header: 'Ano Modelo' },
    ];

    this.loadBrandList();
    this.loadDefaultMaxUploadBytesSize();
    this.loadMandatoryList();
    this.loadResponsabilityList();
    this.loadItemTypeList();
    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadItem() {
    this.itemFormService.getAll().pipe(first()).subscribe(data => {
      this.itemList = data;
    });
  }

  loadBrandList() {
    this.brandService.getAll().pipe(first()).subscribe(data => {
      this.brandList = data ? data : [];
      if (this.brandList.length) {
        this.loadModelList();
      }
    });
  }
  
  loadDefaultMaxUploadBytesSize(){
    this.parameterService.searchByName("MAX_FILE_UPLOAD_SIZE").pipe(first()).subscribe(data => {
      if(data && data.length > 0){
        this.maximumBytesFileSize = Number(data[0].value);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadMandatoryList() {
    this.classifierService.searchByType(ClassifierEnum.ITEM_MANDATORY).pipe(first()).subscribe(data => {
      this.itemMandatoryList = data;
      this.itemMandatoryList.sort((a, b) => (a.id < b.id ? -1 : 1));
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadResponsabilityList() {
    this.classifierService.searchByType(ClassifierEnum.ITEM_RESPONSABILITY).pipe(first()).subscribe(data => {
      this.responsabilityList = data;

      if(this.responsabilityList){
        this.itemRegister.responsability = this.responsabilityList.find( data => data.value == ItemResponsabilityEnum.production);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadModelList() {
    if (this.selectedItemModelBrand && this.selectedItemModelBrand.id) {
      this.modelService.getAllByBrand(this.selectedItemModelBrand.id).pipe(first()).subscribe(data => {
        this.modelList = data.filter(m => m.active === true) ? data.filter(m => m.active === true) : [];
      });
    }
  }

  loadItemTypeList() {
    this.itemTypeService.getAll().pipe(first()).subscribe(data => {
      this.itemTypeList = data ? data : [];
    });
  }

  buildLabelYearModel() {
    if(this.itemRegister.itemModels){
      this.itemRegister.itemModels.map(im => {
        if (im.modelYearStart != FromToMinMax.MIN_YEAR && im.modelYearEnd == FromToMinMax.MAX_YEAR) {
          im.yearModelLabel = `À Partir de ${im.modelYearStart}`;
        } else if (im.modelYearStart == FromToMinMax.MIN_YEAR && im.modelYearEnd != FromToMinMax.MAX_YEAR) {
          im.yearModelLabel = `Até ${im.modelYearEnd}`;
        } else if (im.modelYearStart != FromToMinMax.MIN_YEAR && im.modelYearEnd != FromToMinMax.MAX_YEAR) {
          im.yearModelLabel = `De ${im.modelYearStart} até ${im.modelYearEnd}`;
        } else if (im.modelYearStart == FromToMinMax.MIN_YEAR && im.modelYearEnd == FromToMinMax.MAX_YEAR) {
          im.yearModelLabel = `Todos`;
        }
      });
    }
  }

  onUploadFile(event: any, uploader: FileUpload) {
    if(this.itemFileUrl){
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Para adicionar uma nova Foto, remova a Foto existente!' });
      uploader.remove(event, 0);
      return;
    }

    for(let file of event.files) {
      this.itemFile = file;     

      if(this.itemFile.size > this.maximumBytesFileSize){
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'A Foto não pode ser superior a ' + FileUtil.formatSizeUnits(this.maximumBytesFileSize) });
        this.itemFile = null;
        uploader.remove(event, 0);
        return;
      }

      if(!FileUtil.isImage(this.itemFile.name)){
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Tipo de arquivo inválido, selecione uma imagem!' });
        this.itemFile = null;
        uploader.remove(event, 0);
        return;
      }

      var reader = new FileReader();
        reader.readAsDataURL(this.itemFile);
         reader.onload = (_event) => {
        this.itemFileUrl = reader.result; 
      }
      this.itemFileChanged = true;
    }
    uploader.remove(event, 0);
  }

  onUploadIcon(event, uploader: FileUpload) {
    if(this.iconFileUrl){
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Para adicionar um novo Ícone, remova o Ícone existente!' });
      uploader.remove(event, 0);
      return;
    }

    for(let file of event.files) {
        this.iconFile = file;
        if(this.iconFile.size > this.maximumBytesFileSize){
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'O Ícone não pode ser superior a ' + FileUtil.formatSizeUnits(this.maximumBytesFileSize) });
          this.iconFile = null;
          uploader.remove(event, 0);
          return;
        }

        if(!FileUtil.isImage(this.iconFile.name)){
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Tipo de arquivo inválido, selecione uma imagem!' });
          this.iconFile = null;
          uploader.remove(event, 0);
          return;
        }

        var reader = new FileReader();
		      reader.readAsDataURL(this.iconFile);
		   		reader.onload = (_event) => {
			    this.iconFileUrl = reader.result; 
		    }
        this.iconFileChanged = true;
    }
    uploader.remove(event, 0);
  }

  resetSearchForm() {
    this.loadItem();
    this.itemSearch = new Item();
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.itemRegister = new Item();
    this.itemRegister.term = 0;
    this.itemRegister.itemModels = [];
    
    this.itemRegisterForm && this.itemRegisterForm.reset({
      generic: false,
      forFree: false,
      termWorkDay: false,
      highlight: false,
      term: 0
    });
    
    if(this.responsabilityList){
      this.itemRegister.responsability = this.responsabilityList.find( data => data.value == ItemResponsabilityEnum.production);
    }

    this.resetRegisterModelForm()
    this.resetUploadFiles();
  }

  resetUploadFiles() {
    this.itemFile = null;
    this.itemFileUrl = null;
    this.itemFileChanged = false;
    this.itemFileDeleted = false;

    this.iconFile = null;
    this.iconFileUrl = null;
    this.iconFileChanged = false;
    this.iconFileDeleted = false;
  }

  cleanFile(type: string){
    this.itemFile = null;
    this.itemFileUrl = null;
    this.itemFileChanged = true;
    this.itemFileDeleted = true;
  }

  cleanIcon(){
    this.iconFile = null;
    this.iconFileUrl = null;
    this.iconFileChanged = true;
    this.iconFileDeleted = true;
  }

  resetRegisterModelForm() {
    this.isEditModel = false;
    this.itemModelRegister = new ItemModel();
    this.selectedItemModelBrand = new Brand();
    this.selectedFromTop = new Classifier();
  }

  search(event) {
    if (event && event.first) {
      this.itemSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.itemSearch.first = 0;
    }

    if (this.itemSearch.name) {
      this.itemFormService.search(this.itemSearch).pipe(first()).subscribe(data => {
        this.itemList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.itemFormService.getAll().pipe(first()).subscribe(data => {
        this.itemList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  edit(event) {
    this.isEdit = true;

    this.resetUploadFiles();
    this.resetRegisterModelForm();

    this.itemFormService.getById(this.itemRegister.id).pipe(first()).subscribe(data => {
      this.itemRegister = data;
      
      if(this.itemRegister.file){
        this.itemFormService.image(this.itemRegister.file).pipe(first()).subscribe(base64 => {
          this.itemFileUrl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64.file);
          this.itemFileChanged = false;
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }

      if(this.itemRegister.icon){
        this.itemFormService.image(this.itemRegister.icon).pipe(first()).subscribe(base64 => {
          this.iconFileUrl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64.file);
          this.iconFileChanged = false;
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }

      if (this.itemRegister.termWorkDay == undefined){
        this.itemRegister.termWorkDay = false;
      }

      if (this.itemRegister.highlight == undefined){
        this.itemRegister.highlight = false;
      }

      this.buildLabelYearModel();
    });
  }

  save() {
    let method = this.itemRegister.id ? 'update' : 'save';
    let message = this.itemRegister.id ? 'atualizado' : 'adicionado';

    if (this.itemRegister.forFree == undefined)
      this.itemRegister.forFree = false;

    if (this.itemRegister.generic == undefined)
      this.itemRegister.generic = false;

    if (this.itemRegister.termWorkDay == undefined)
      this.itemRegister.termWorkDay = false;

    if (this.itemRegister.highlight == undefined)
      this.itemRegister.highlight = false;

    let itemRegisterSave = Object.assign({}, this.itemRegister);

    if (this.itemRegister.itemModels) {
      itemRegisterSave.itemModels = [];
      this.itemRegister.itemModels.forEach((item, index) => {
        let model = new Model;
        model.id = item.model.id;
        itemRegisterSave.itemModels.push(item);
      });
    }
    
    if(!this.itemFileUrl){
      itemRegisterSave.file = null;
    }

    if(!this.iconFileUrl){
      itemRegisterSave.icon = null;
    }

    this.itemFormService[method](itemRegisterSave).pipe(first()).subscribe(data => {
      if(this.itemFileChanged && !this.itemFileDeleted){
        this.itemFormService.upload(method =="save" ? data.id : itemRegisterSave.id, this.itemFile, "file").pipe(first()).subscribe(uploadFile => {});
      }

      if(this.iconFileChanged && !this.iconFileDeleted){
        this.itemFormService.upload(method =="save" ? data.id : itemRegisterSave.id, this.iconFile, "icon").pipe(first()).subscribe(uploadFile => {});
      }

      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Salvo com sucesso',
        detail: `Registro ${message} com sucesso!`
      });
      this.resetSearchForm();
      this.resetRegisterForm();
      this.loadItem();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(Item: Item) {
    this.confirmationService.confirm({
      message: `Deseja remover ${Item.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.itemFormService.delete(Item.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com Sucesso!', detail: 'Registro removido com sucesso!' });
          this.loadItem();
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  removeItemModel(itemModel: ItemModel) {
    let index = itemModel.model.id + itemModel.modelYearStart + itemModel.modelYearEnd;
    this.itemRegister.itemModels.splice(index, 1);
    this.itemRegister.itemModels = [...this.itemRegister.itemModels];

  }

  saveModel() {
    if (!this.itemRegister.itemModels) {
      this.itemRegister.itemModels = [];
    }

    if (this.isFormModelValid()) {
      let itemModel = Object.assign({}, this.itemModelRegister);
      this.setYearMinMaxModel(itemModel);

      itemModel.yearModel = itemModel.model.id + itemModel.modelYearStart + itemModel.modelYearEnd;

      if(this.itemRegister.itemModels.some(data => data.yearModel == itemModel.yearModel)){
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Modelo já cadastrado com o mesmo Ano Modelo Período!' });
        return;
      }

      if (itemModel.id != null) {
        this.itemRegister.itemModels = this.itemRegister.itemModels.map(item => {
          return item.id == itemModel.id ? itemModel : item
        });
      } else {
        this.itemRegister.itemModels.push(itemModel);
      }
      this.itemRegister.itemModels = [...this.itemRegister.itemModels];
      this.resetRegisterModelForm();
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Informe todos os campos obrigatórios de modelo' });
    }

    this.buildLabelYearModel();
  }

  editModel(event) {
    this.isEditModel = true;
    this.itemModelRegister = Object.assign({}, this.itemModelRegister);
    this.itemModelRegister.yearModel = this.itemModelRegister.model.id + this.itemModelRegister.modelYearStart + this.itemModelRegister.modelYearEnd;
    
    this.selectedItemModelBrand = this.itemModelRegister.model.brand;

    if (this.itemModelRegister.modelYearEnd == this.fromToMinMax.MAX_YEAR) {
      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.FROM)[0];
    }

    if (this.itemModelRegister.modelYearStart == this.fromToMinMax.MIN_YEAR) {
      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.TO)[0];
    }

    if (this.itemModelRegister.modelYearEnd == this.fromToMinMax.MAX_YEAR &&
      this.itemModelRegister.modelYearStart == this.fromToMinMax.MIN_YEAR) {

      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.ALL)[0];
    }

    if (this.itemModelRegister.modelYearEnd != this.fromToMinMax.MAX_YEAR &&
      this.itemModelRegister.modelYearStart != this.fromToMinMax.MIN_YEAR) {

      this.selectedFromTop = this.fromToList.filter(fromTo => fromTo.type == this.fromToEnum.FROMTO)[0];
    }

    this.loadModelList();
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
    if (!this.itemModelRegister) return false;
    
    if (!this.itemModelRegister.model) return false;

    if(!this.selectedFromTop || !this.selectedFromTop.id) return false;

    if (this.selectedFromTop.type == this.fromToEnum.FROM && !this.itemModelRegister.modelYearStart) {
      return false
    }
    if (this.selectedFromTop.type == this.fromToEnum.TO && !this.itemModelRegister.modelYearEnd) {
      return false
    }
    if (this.selectedFromTop.type == this.fromToEnum.FROMTO
      && (!this.itemModelRegister.modelYearEnd || !this.itemModelRegister.modelYearEnd)) {
      return false
    }
   
    return true;
  }

  resetSelectedFromTop() {
    this.itemModelRegister.modelYearEnd = null;
    this.itemModelRegister.modelYearStart = null;
  }
}