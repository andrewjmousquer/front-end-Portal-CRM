import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Contact } from 'src/app/shared/model/contact.model';
import { Qualification } from 'src/app/shared/model/qualification.model';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { QualificationService } from 'src/app/shared/service/qualification.service';
import { Utils } from 'src/app/shared/util/util';
import * as _ from "lodash";
import { Brand } from 'src/app/shared/model/brand.model';
import { Model } from 'src/app/shared/model/model.model';
import { Bank } from 'src/app/shared/model/bank.model';
import { BrandFormService } from '../brand-form/brand-form.service';
import { ModelFormService } from '../model-form/model-form.service';
import { BankFormService } from '../bank-form/bank-form.service';

@Component({
  selector: 'app-qualification-form',
  templateUrl: './qualification-form.component.html',
  styleUrls: ['./qualification-form.component.css']
})
export class QualificationFormComponent implements OnInit {

  cols: any[];
  colsQuali: any[];
  colsPerson: any[];
  colsContact: any[];
  colsBank: any[];

  brand: Brand;
  brandName: string;
  brandList: Brand[];
  brandRegister: any;

  model: Model;
  modelName: string;
  modelList: Model[];
  modelRegister: any;

  bank: Bank;
  bankName: string;
  bankList: Bank[];
  bankRegister: any;

  contactList: Contact[];
  contactTypeList: Classifier[];

  displayModal: boolean;

  contact: Contact;

  qualification: Qualification

  qualificationSearch: Qualification;
  qualificationRegister: Qualification = new Qualification;
  qualificationList: Qualification[];

  loading: boolean = false;
  isEdit: boolean = false;
  isContactPhone = false;
  isContactEmail = false;
  isContactMobile = false;

  componentContactBackup: Contact;
  @Input() componentContact: Contact;
  @Input() componentContactList: Contact[];

  util: Utils = new Utils();

  @ViewChild('contactForm', { static: false }) contactForm: any;
  @ViewChild('qualificationRegisterForm', { static: false }) qualificationRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private qualificationService: QualificationService,
    private brandService: BrandFormService,
    private modelService: ModelFormService,
    private bankService: BankFormService,
    private classifierService:ClassifierService
  ) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Qualificação' },
      { field: 'seq', header: 'Situação' },
      { field: 'parentId', header: 'Cliente' },
      { field: 'username', header: 'Proposta' },
      { field: 'person', header: 'Pedido' }
    ];

    this.colsPerson = [
      { field: 'name', header: 'Nome' },
      { field: 'seq', header: 'Papel' },
      { field: 'parentId', header: 'Qualificação' }
    ];

    this.colsQuali = [
      { field: 'parentId', header: 'Qualificação' },
      { field: 'obs', header: 'Observações' },
    ];

    this.colsContact = [
      { field: 'typeContact', header: 'Meio de Contato' },
      { field: 'contact', header: 'Contato' },
    ];

    this.colsBank = [
      { field: 'bank', header: 'Banco' },
      { field: 'agencia', header: 'ContaAgênciato' },
      { field: 'conta', header: 'Conta' },
      { field: 'type', header: 'Tipo de Conta' },
    ];

    this.brand = new Brand();
    this.qualificationRegister = new Qualification();

    this.qualificationList = new Array<Qualification>();
    this.brandList = new Array<Brand>();
    this.modelList = new Array<Model>();
    this.bankList = new Array<Bank>();

    this.loadBrandList();
    this.loadModelList();
    this.loadBankList();
    this.resetContactForm();

    this.classifierService.searchByType("CONTACT_TYPE").pipe(first()).subscribe(data => {
      this.contactTypeList = data;
    });
  }

  showModalDialog() {
    this.displayModal = true;
  }

  loadContact() {
    this.classifierService.searchByType("CONTACT_TYPE").pipe(first()).subscribe(data => {
      this.contactTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadBrandList() {
    this.brandService.getAll().pipe().subscribe(data => {
      this.brandList = data ? data : []
    })
  }

  loadModelList() {
    this.modelService.getAll().pipe().subscribe(data => {
      this.modelList = data ? data : []
    })
  }

  loadBankList() {
    this.bankService.getAll().pipe().subscribe(data => {
      this.bankList = data ? data : []
    })
  }

  search(event) {
    if (event && event.first) {
      this.qualificationSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.qualificationSearch.first = 0;
    }
    this.qualificationService.search(this.qualificationSearch).pipe(first()).subscribe(data => {
            this.qualificationList = data;
    });
  }

  changeContactType() {
    if (this.componentContact.type.value == "EMAIL") {
      this.isContactEmail = true;
      this.isContactPhone = false;
      this.isContactMobile = false;
    } else if (this.componentContact.type.value == "CELULAR") {
      this.isContactEmail = false;
      this.isContactPhone = false;
      this.isContactMobile = true;
    } else if (this.componentContact.type.value == "TELEFONE") {
      this.isContactEmail = false;
      this.isContactPhone = true;
      this.isContactMobile = false;
    } else {
      this.isContactEmail = false;
      this.isContactPhone = false;
      this.isContactMobile = false;
    }
  }

  resetRegisterForm() {
  }

  resetContactForm() {
    this.componentContact = new Contact();
    this.componentContact.type = new Classifier()
    this.isContactPhone = false;
    this.isContactEmail = false;
    this.isContactMobile = false;
    this.changeContactType();
  }

  newContactForm() {
    if (this.isEdit) {
      this.confirmationService.confirm({
        message: `Deseja salvar as alterações de ${this.componentContact.type.value}?`,
        header: 'Excluir registro',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.addContact();
        },
        reject: () => {
          this.componentContact = _.clone(this.componentContactBackup);
          this.addContact();
        }
      });
    } else {
      this.resetContactForm();
    }
  }

  addContact() {
    let valid: boolean = true;
    if (this.componentContact.type.id == undefined || this.componentContact.type.id == 0) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro ao adicionar contato', detail: 'Selecion um tipo de contato!' });
      return;
    }

    if (this.componentContact.value == undefined || this.componentContact.value == null) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro ao adicionar contato', detail: 'Digite o contato!' });
      return;
    }

    if (this.componentContactList.length > 0) {
      this.componentContactList.forEach(item => {
        if (item.value == this.componentContact.value) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Contato existente', detail: 'Esse contato já existe' });
          valid = false;
        }
      });
    }

    if (valid) {
      this.componentContactList.push(this.componentContact);
      this.resetContactForm();
    }
  }

  editContact(event) {
    let contact = event.data;
    this.componentContactBackup = _.clone(contact);
    this.componentContact = contact;
    this.isEdit = true;
    this.changeContactType();

    let index = this.componentContactList.indexOf(contact);
    this.componentContactList = this.componentContactList.filter((val, i) => i != index);
  }

  removeContact(contact: Contact) {
    this.confirmationService.confirm({
      message: `Deseja remover ${contact.value}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        let index = this.componentContactList.indexOf(contact);
        this.componentContactList.splice(index, 1)
      }
    });
  }
}
