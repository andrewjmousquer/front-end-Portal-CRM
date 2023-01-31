import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import * as _ from "lodash";

import { BrandFormService } from '../brand-form/brand-form.service';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ChannelFormService } from '../channel-form/channel-form.service';
import { PartnerFormService } from './partner-form.service';
import { PartnerGroupFormService } from '../partner-group-form/partner-group-form.service';
import { PersonService } from 'src/app/shared/service/person.service';
import { SellerFormService } from '../seller-form/seller-form.service';

import { Brand } from 'src/app/shared/model/brand.model';
import { Channel } from 'src/app/shared/model/channel-model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { PartnerGroup } from 'src/app/shared/model/partner-group.model';
import { Person } from 'src/app/shared/model/person.model';
import { Seller } from 'src/app/shared/model/seller.model';
import { Status } from 'src/app/shared/model/status.model';

import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { PersonDocumentEnum } from 'src/app/shared/enum/person-document-enum';
import { StatusDictionary } from 'src/app/shared/dictionary/status.dictionary';
import { MaskEnum } from 'src/app/shared/enum/mask-enum';

import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { PersonUtil } from 'src/app/shared/util/person.util';
import { PartnerPerson } from 'src/app/shared/model/partner-person.model';
import { PartnerPersonCommission } from 'src/app/shared/model/partner-person-comission.model';
import { CommissionTypeEnum } from 'src/app/shared/enum/commission-type-enum';
import { PersonTypeEnum } from 'src/app/shared/enum/person-type-enum';
import { ThisReceiver } from '@angular/compiler';
import { PartnerSituationTypeEnum } from 'src/app/shared/enum/partner-situation-enum';

@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.css']
})
export class PartnerFormComponent implements OnInit {

  @Input() resume: boolean;
  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('dtEmployee', { static: false }) dtEmployee: any;
  @ViewChild('partnerRegisterForm', { static: false }) partnerRegisterForm: NgForm;

  isEdit = false;
  isEditEmployee = false;
  indexEdit: number = 0;
  cols: any[];

  modelList: Partner[];
  modelSearch: Partner ;
  modelRegister: Partner;

  channelList: Channel[];
  partnerGroupList: PartnerGroup[];
  personClassifierEnum: any = PersonClassifierEnum;

  situationList: Classifier[];
  selectedSituation: Classifier;

  brandSearch: Brand;
  brandList: Brand[];
  brandAvailableList: Brand[];
  brandSelectedList: Brand[];

  colsEmployee: any[];
  employeeSearch: PartnerPerson;
  employeeRegister: PartnerPerson;
  employeeRegisterBkp: PartnerPerson;
  employeeList: PartnerPerson[];
  displayEmployeeModal: boolean;
  defaultCommission: number;
  defaultBonus: number;
  defaultPayPrize: number;
  commissionList: PartnerPersonCommission[];

  sellerSearch: Seller;
  sellerList: Seller[];
  sellerAvailableList: Seller[];
  sellerSelectedList: Seller[];

  personClassificationList: Classifier[];
  personTypeList: Classifier[];
  personJobList: Classifier[];
  comissionTypeList: Classifier[];

  selectedPersonClassifier: Classifier;
  selectedPersonType: Classifier;

  personDocumentEnum: any = PersonDocumentEnum;
  maskEnum: any = MaskEnum;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private partnerFormService: PartnerFormService,
    private partnerGroupFormService: PartnerGroupFormService,
    private personService: PersonService,
    private classifierService: ClassifierService,
    private channelFormSerivce: ChannelFormService,
    private brandFormService: BrandFormService,
    private sellerFormService: SellerFormService) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'partnerGroup.name', header: 'Grupo' },
      { field: 'channel', header: 'Canal' }
    ];

    this.colsEmployee = [
      { field: 'name', header: 'Nome' },
      { field: 'jobTitle', header: 'Cargo' }
    ];


    this.resetSearchForm();
    this.resetRegisterForm();

    this.loadPersonClassificationList();
    this.loadPartnerAgentType();
    this.loadPartnerSituationList();
    this.loadComissionTypeList();
    this.loadPartners();
    this.loadChannels();
    this.loadBrands();
    this.loadSellers();
    this.loadPartnerGroups();
  }

  resetSearchForm() {
    this.modelSearch = new Partner();
    this.modelSearch.partnerGroup = new PartnerGroup();
    this.modelSearch.channel = new Channel();
    this.loadPartners();
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.modelRegister = new Partner();
    this.modelRegister.person = new Person();
    this.modelRegister.person.classification = new Classifier();
    this.modelRegister.person.name = "";
    this.modelRegister.isAssistance = true;

    this.partnerRegisterForm && this.partnerRegisterForm.reset();

    this.loadPersonClassificationList();// Necessário load pois acima resetamos modelRegister.person

    this.sellerAvailableList = _.clone(this.sellerList);
    this.sellerSelectedList = [];

    if(this.situationList && this.situationList.length > 0){
      this.selectedSituation = this.situationList.find( situation  => { return situation.value == PartnerSituationTypeEnum.active });
    }

    this.brandSearch = new Brand();
    this.brandAvailableList = _.clone(this.brandList);
    this.brandSelectedList = [];

    this.sellerSearch = new Seller();
    this.sellerSearch.person = new Person();
    
    this.resetEmployeeSearch();
    this.resetEmployeeRegister();
    this.employeeList = []
    this.displayEmployeeModal = false;

    if(this.personClassificationList && this.personClassificationList.length > 0){
      this.modelRegister.person.classification = this.personClassificationList.find( x =>
        x.value == PersonClassifierEnum.physical);
    }
  }

  loadPartners() {
    this.partnerFormService.getAll().pipe(first()).subscribe(data => {
      this.modelList = data;
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

    let method = this.modelSearch.person == null || this.modelSearch.person.name == "" ? 'getAll' : 'search';
    let variable = this.modelSearch.person == null ? new Partner() : this.modelSearch.person;
    this.partnerFormService[method](variable).pipe(first()).subscribe(data => {
      this.modelList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPerson() {
    const searchText = PersonUtil.getDocumentPerson(this.modelRegister.person);
    if (searchText && searchText !== 'false') {
      this.personService.findByDocument(searchText).pipe(first()).subscribe(data => {
        if (data && data != null) {
          this.confirmationService.confirm({
            message: `A pessoa ${data.name} já está cadastrada, deseja utilizar o cadastro existente?`,
            header: 'Descartar edição de parceiro?',
            acceptLabel: 'Confirmar',
            rejectLabel: 'Cancelar',
            accept: () => {
              this.modelRegister.person = data;
            },
            reject: () => {

            }
          });
        }
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Informe um número de documento válido!' });
    }
  }

  loadPersonClassificationList() {
    this.classifierService.searchByType(ClassifierEnum.PERSON_CLASSIFICATION).pipe(first()).subscribe(data => {
      this.personClassificationList = data;

      if(this.modelRegister && this.modelRegister.person){
        this.modelRegister.person.classification = this.personClassificationList.find( personType => personType.value === PersonClassifierEnum.physical);
      }

      if(this.employeeRegister && this.employeeRegister.person){
        this.employeeRegister.person.classification = this.personClassificationList.find( personType => personType.value === PersonClassifierEnum.physical);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPartnerSituationList() {
    this.classifierService.searchByType(ClassifierEnum.PARTNER_SITUATION).pipe(first()).subscribe(data => {
      this.situationList = data;

      if(this.situationList && this.situationList.length > 0){
        this.selectedSituation = this.situationList.find( situation  => { return situation.value == PartnerSituationTypeEnum.active });
      }

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPartnerAgentType() {
    this.classifierService.searchByType(ClassifierEnum.PERSON_TYPE).pipe(first()).subscribe(data => {
      this.personTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadComissionTypeList() {
    this.classifierService.searchByType(ClassifierEnum.COMMISSION_TYPE).pipe(first()).subscribe(data => {
      this.comissionTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPersonJobType() {
    this.classifierService.searchByType(ClassifierEnum.PERSON_TYPE).pipe(first()).subscribe(data => {
      this.personJobList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadBrands() {
    this.brandFormService.getAll().pipe(first()).subscribe(data => {
      this.brandList = data;
      this.brandAvailableList = _.clone(this.brandList);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  onCompletePerson(person: Person) {
    this.modelRegister.person = person;
  }

  loadChannels() {
    this.channelFormSerivce.getAll().pipe(first()).subscribe(data => {
      this.channelList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPartnerGroups() {
    this.partnerGroupFormService.getAll().pipe(first()).subscribe(data => {
      this.partnerGroupList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadSellers() {
    this.sellerFormService.getAll().pipe(first()).subscribe(data => {
      this.sellerList = data;
      this.sellerAvailableList = _.clone(this.sellerList);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    this.isEdit = true;

    this.partnerFormService.getById(this.modelRegister.id).pipe(first()).subscribe(data => {
      this.modelRegister = data;

      this.selectedSituation = this.modelRegister.situation;

      this.fillBrandsToEdit();
      this.fillSellersToEdit();
      this.fillEmployeesToEdit();

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  fillSellersToEdit(){
    this.sellerAvailableList = [];
    this.sellerSelectedList = [];

    if (this.modelRegister.sellerList && this.modelRegister.sellerList.length > 0) {
      this.sellerSelectedList = this.modelRegister.sellerList;
      this.sellerList.forEach(itemBD => {
        let insertItem: boolean = true;
        this.sellerSelectedList.forEach(itemView => {
          if (insertItem == true) {
            if (itemBD.id == itemView.id) {
              insertItem = false;
            }
          }
        })

        if (insertItem == true) {
          this.sellerAvailableList.push(itemBD);
        }
      });
    } else {
      this.sellerAvailableList = _.clone(this.sellerList);
    }
  }

  fillBrandsToEdit(){
    this.brandAvailableList = [];
    this.brandSelectedList = [];

    if (this.modelRegister.brandList && this.modelRegister.brandList.length > 0) {
      this.brandSelectedList = _.clone(this.modelRegister.brandList);
      this.brandList.forEach(itemBD => {
        let insertItem: boolean = true;
        this.brandSelectedList.forEach(itemView => {
          if (insertItem == true) {
            if (itemBD.id == itemView.id) {
              insertItem = false;
            }
          }
        })

        if (insertItem == true) {
          this.brandAvailableList.push(itemBD);
        }
      });
    } else {
      this.brandAvailableList = _.clone(this.brandList);
    }
  }

  fillEmployeesToEdit(){

    this.resetEmployeeRegister();

    if (this.modelRegister.employeeList && this.modelRegister.employeeList.length > 0) {
      this.employeeList = this.modelRegister.employeeList;
    } else {
      this.employeeList = [];
    }
  }

  remove(partner: Partner) {
    this.confirmationService.confirm({
      message: `Deseja remover ${partner.person.name} como parceiro?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.partnerFormService.delete(partner.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  confirmSave(){
    if(this.isEditEmployee){
      this.confirmationService.confirm({
        message: `O parceiro ${this.employeeRegister.person.name} está sendo editado, deseja salvar as alterações realizadas?`,
        header: 'Descartar edição de parceiro?',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        accept: () => {
            this.saveEmployee();
            this.save();
        },
        reject: () => {
          this.employeeList.push(this.employeeRegisterBkp);
          this.resetEmployeeRegister();
          this.save();
        }
      });
    } else {
      this.save();
    }
  }

  save() {
    this.modelRegister.situation = this.selectedSituation;
    let method = this.modelRegister.id ? 'update' : 'save';
    let message = this.modelRegister.id ? 'atualizado' : 'adicionado';

    if(!this.modelRegister.isAssistance) {
      this.modelRegister.isAssistance = false;
    }

    if(this.brandSelectedList != null && this.brandSelectedList.length > 0){
      this.modelRegister.brandList = this.brandSelectedList;
    }

    if(this.sellerSelectedList != null && this.sellerSelectedList.length > 0){
      this.modelRegister.sellerList = this.sellerSelectedList;
    }

    if(this.employeeList != null && this.employeeList.length > 0){
      this.modelRegister.employeeList = this.employeeList;
    }

    this.partnerFormService[method](this.modelRegister).pipe(first()).subscribe(data => {
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

  resetBrandSearchName(){
    this.brandAvailableList = Array.from(this.brandList);
    this.brandSearch = new Brand();
  }

  fillBrand() {
    this.brandAvailableList = Array.from(this.brandAvailableList);

    this.brandAvailableList = Array.from(this.brandList.filter(brand => {
       return ( (this.brandSearch && this.brandSearch.name ) ? (brand.name ? brand.name.toLowerCase().indexOf(this.brandSearch.name.toLowerCase()) > -1 : false) : true)
     }));
  }

  resetSellerSearchName(){
    this.sellerAvailableList = Array.from(this.sellerList);
    this.sellerSearch = new Seller();
    this.sellerSearch.person = new Person();
  }

  fillSeller() {
    this.sellerAvailableList = Array.from(this.sellerList);
    this.sellerAvailableList = Array.from(this.sellerList.filter(seller => {
       return ( (this.sellerSearch && this.sellerSearch.person && this.sellerSearch.person.name ) ? (seller.person.name ? seller.person.name.toLowerCase().indexOf(this.sellerSearch.person.name.toLowerCase()) > -1 : false) : true)
     }));
  }

  searchEmployee() {
    this.employeeList = Array.from(this.modelRegister.employeeList);

    this.employeeList = Array.from(this.employeeList.filter(x => {
       return ( (this.employeeSearch && this.employeeSearch.person && this.employeeSearch.person.name ) ? (x.person.name ? x.person.name.toLowerCase().indexOf(this.employeeSearch.person.name.toLowerCase()) > -1 : false) : true)
     }));
  }

  openEmployeeModal(){
    if(this.modelRegister && this.modelRegister.person && this.modelRegister.person.id > 0){
      this.resetEmployeeRegister();
      this.displayEmployeeModal = true;
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "É necessário selecionar um parceiro para adicionar colaboradores!" });
    }
  }

  closeEmployeeModal(person: Person) {
    if(person) {
      this.employeeRegister.person = person;
      this.isEditEmployee = true;
    }
    this.displayEmployeeModal = false;
  }

  cancelEmployeeModal() {
    this.displayEmployeeModal = false;
  }

  editEmployee() {
    this.isEditEmployee = true;
    this.employeeRegisterBkp = _.clone(this.employeeRegister);

    this.defaultCommission = null;
    this.defaultBonus = null;
    this.defaultPayPrize = null;

    if(this.employeeRegister && this.employeeRegister.commissionList && this.employeeRegister.commissionList.length > 0){
      this.employeeRegister.commissionList.forEach( commission => {
        if(commission.commissionType.value === CommissionTypeEnum.commission){
          this.defaultCommission = commission.defaultValue;
        } else if(commission.commissionType.value === CommissionTypeEnum.bonus){
          this.defaultBonus = commission.defaultValue;
        } else if(commission.commissionType.value === CommissionTypeEnum.pay_prize){
          this.defaultPayPrize = commission.defaultValue;
        }
      });
    }
  }

  saveEmployee(){
    let valid = true;

    if(!this.employeeRegister.personType || !this.employeeRegister.personType.id){
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "É necessário selecionar o perfil do Colaborador na aba Comissão Geral!" });
      return;
    }

    if(this.defaultCommission){
      const defaultCommission = new PartnerPersonCommission();
      defaultCommission.defaultValue = this.defaultCommission;
      defaultCommission.commissionType = this.comissionTypeList.find( x => x.value == CommissionTypeEnum.commission);
      this.commissionList.push(defaultCommission);
    }

    if(this.defaultBonus){
      const defaultBonus = new PartnerPersonCommission();
      defaultBonus.defaultValue = this.defaultBonus;
      defaultBonus.commissionType = this.comissionTypeList.find( x => x.value == CommissionTypeEnum.bonus);
      this.commissionList.push(defaultBonus);
    }

    if(this.defaultPayPrize){
      const defaultBonus = new PartnerPersonCommission();
      defaultBonus.defaultValue = this.defaultPayPrize;
      defaultBonus.commissionType = this.comissionTypeList.find( x => x.value == CommissionTypeEnum.pay_prize);
      this.commissionList.push(defaultBonus);
    }

    if(this.commissionList && this.commissionList.length > 0){
      this.employeeRegister.commissionList = this.commissionList;
    }

    const partner = new Partner();
    partner.id = this.modelRegister.id;
    this.employeeRegister.partner = partner;

    let exists = false;

    this.employeeList.forEach( x => {
      if(x.person.id == this.employeeRegister.person.id){
        x = this.employeeRegister
        exists = true;
      }
    });

    if(!exists) {
      this.employeeList.push(this.employeeRegister);
    }

    this.resetEmployeeRegister();
  }

  resetEmployeeSearch(){

    if(this.modelRegister && this.modelRegister.employeeList && this.modelRegister.employeeList.length > 0){
      this.employeeList = Array.from(this.modelRegister.employeeList);
    }

    this.employeeSearch = new PartnerPerson();
    this.employeeSearch.person = new Person();
  }

  resetEmployeeRegister(){
    this.employeeRegister = new PartnerPerson();
    this.employeeRegister.person = new Person();
    this.employeeRegister.personType = new Classifier();

    if(this.personClassificationList && this.personClassificationList.length > 0){
      this.employeeRegister.person.classification = this.personClassificationList.find( x => x.value == PersonClassifierEnum.physical);
    }

    if(this.personTypeList && this.personTypeList.length > 0){
      this.employeeRegister.personType = this.personTypeList.find( x => x.value ==  PersonTypeEnum.seller);
    }

    this.defaultBonus = null;
    this.defaultCommission = null;
    this.defaultPayPrize = null;
    this.commissionList =  [];
    this.isEditEmployee = false;
  }

  removeEmployee(employee: PartnerPerson) {
    this.confirmationService.confirm({
      message: `Deseja remover ${employee.person.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        let index = this.employeeList.indexOf(employee);
        this.employeeList.splice(index, 1)
      }
    });
  }

}
