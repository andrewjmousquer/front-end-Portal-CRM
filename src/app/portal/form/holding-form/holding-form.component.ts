import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as _ from "lodash";

import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';

import { HoldingFormService } from './holding-form.service';

import { CityService } from '../../../shared/service/city.service';
import { CountryService } from '../../../shared/service/country.service';
import { StateService } from '../../../shared/service/state.service';

import { Utils } from '../../../shared/util/util';

import { Address } from '../../../shared/model/address.model';
import { City } from '../../../shared/model/city.model';
import { Country } from '../../../shared/model/country.model';
import { Contact } from '../../../shared/model/contact.model';
import { Customer } from '../../../shared/model/customer.model';
import { Holding } from '../../../shared/model/holding.model';
import { Person } from 'src/app/shared/model/person.model';
import { State } from '../../../shared/model/state.model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { MaskEnum } from 'src/app/shared/enum/mask-enum';

@Component({
  selector: 'wbp-holding-form',
  templateUrl: './holding-form.component.html'
})
export class HoldingFormComponent implements OnInit {
  isEdit: boolean = false;
  isEditCustomer: boolean = false;

  personClassifierEnum: any = PersonClassifierEnum;
  maskEnum: any = MaskEnum;

  countryList: Country[];
  cityList: City[]
  contactList: Contact[];
  customerList: Customer[];
  customerListDeleted: Customer[];
  holdingList: Holding[];
  stateList: State[];
  items: MenuItem[];
  cols: any[];

  holdingTypeList: Classifier[];

  contact: Contact;
  country: Country;
  city: City;
  customer: Customer;
  customerBackup: Customer;
  person: Person;
  state: State;

  home: MenuItem;
  holdingSearch: Holding;
  holdingRegister: Holding;


  util: Utils = new Utils();

  @ViewChild('holdingRegisterForm', { static: false }) holdingRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private holdingFormService: HoldingFormService,
    private cityService: CityService,
    private countryService: CountryService,
    private stateService: StateService,
    private classifierService: ClassifierService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome', width: '60%' },
      { field: 'cnpj', header: 'DOC', width: '40%', cnpj: true }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
    this.loadCombos();
  }

  loadHoldings() {

    this.holdingFormService.getAll().pipe(first()).subscribe(data => {
      this.holdingList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadCombos() {
    this.loadContries();
    this.loadStates();
    this.loadHoldingTypes();
  }

  loadHoldingTypes() {
    this.classifierService.searchByType(ClassifierEnum.HOLDING_TYPE).pipe(first()).subscribe(data => {
      this.holdingTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadContries() {
    this.countryService.getAll().pipe(first()).subscribe(data => {
      this.countryList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadStates() {
    this.stateService.getAll().pipe(first()).subscribe(data => {
      this.stateList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadStatesByCountry(country: Country) {
    this.stateService.getByCountry(country).pipe(first()).subscribe(data => {
      this.stateList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadCitiesByState(state: State) {
    this.cityService.getByState(state).pipe(first()).subscribe(data => {
      this.cityList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }
  changeHoldingType(cla: Classifier) {
    if (!cla) {
      this.holdingRegister.cnpj = null;
    }
  }

  changeCustomerType(cla: Classifier) {
    if (!cla) {
      this.customer.cnpj = null;
    }
  }

  resetSearchForm() {
    this.holdingSearch = new Holding();
    this.loadHoldings();
    this.loadCombos();
  }

  search(event) {
    if (event && event.first) {
      this.holdingSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.holdingSearch.first = 0;
    }

    this.holdingFormService.search(this.holdingSearch).pipe(first()).subscribe(data => {
      this.holdingList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {

    let holding = event.data;
    this.resetRegisterForm();

    this.holdingFormService.getById(holding.id).pipe(first()).subscribe(data => {
      this.holdingRegister = data;
      if (this.holdingRegister.customers.length > 0) {
        this.customerList = this.holdingRegister.customers;
      }

      if (this.holdingRegister.person != null) {
        if (this.holdingRegister.person.contacts != null) {
          if (this.holdingRegister.person.contacts.length > 0) {
            this.contactList = this.holdingRegister.person.contacts;
          }
        }
      }

      this.stateService.getByCountry(data.address.city.state.country).pipe(first()).subscribe(dataCountry => {
        this.stateList = dataCountry;
        this.state = data.address.city.state;
      });

      this.cityService.getByState(data.address.city.state).pipe(first()).subscribe(dataCity => {
        this.cityList = dataCity;
        this.city = data.address.city;
      });

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.isEdit = true;
  }

  remove(holding: Holding) {
    this.confirmationService.confirm({
      message: `Deseja remover ${holding.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {

        this.holdingFormService.delete(holding.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {

    if (this.customerList != null && this.customerList.length > 0) {
      this.holdingRegister.customers = this.customerList;
    }

    if (this.customerListDeleted != null && this.customerListDeleted.length > 0) {
      this.holdingRegister.deletedCustomers = this.customerListDeleted;
    }

    if (this.contactList != null && this.contactList.length > 0) {
      this.holdingRegister.person.contacts = this.contactList;
    } else {
      this.holdingRegister.person.contacts = [];
    }

    this.holdingFormService.save(this.holdingRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.isEditCustomer = false;
    this.customer = new Customer();
    this.customerList = [];
    this.customerListDeleted = [];
    this.contactList = [];
    this.holdingRegister = new Holding();
    this.holdingRegister.person = new Person();
    this.holdingRegister.address = new Address();
    this.holdingRegister.address.city = new City();
    this.holdingRegister.address.city.state = new State();
    this.holdingRegister.address.city.state.country = new Country();
  }

  resetCustomerForm() {
    if (this.isEditCustomer) {
      this.confirmationService.confirm({
        message: `Deseja salvar as alterações de ${this.customer.name}?`,
        header: 'Edição em andamento',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.addCustomer();
        },
        reject: () => {
          this.customer = _.clone(this.customerBackup);
          this.addCustomer();
        }
      });
    }
  }

  addCustomer() {
    let valid: boolean = true;
    if (this.customer.name == undefined || this.customer.name == "0") {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro ao adicionar cliente', detail: 'Digite um nome!' });
      return;
    }

    if (this.customer.cnpj == undefined || this.customer.cnpj == "0") {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro ao adicionar cliente', detail: 'Digite um CNPJ!' });
      return;
    }

    if (this.customerList.length > 0) {
      this.customerList.forEach(item => {
        if (item.cnpj == this.customer.cnpj) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Cliente existente', detail: 'Um cliente com esse CNPJ já existe' });
          valid = false;
        }
      });
    }

    if (valid) {
      this.customerList.push(this.customer);
      this.customer = new Customer();
      this.isEditCustomer = false;
    }
  }

  editCustomer(event) {
    if (this.isEditCustomer) {
      this.resetCustomerForm();
    } else {
      this.isEditCustomer = true;
      this.customer = event.data;
      this.customerBackup = _.clone(this.customer);

      let index = this.customerList.indexOf(this.customer);
      this.customerList = this.customerList.filter((val, i) => i != index);
    }
  }

  removeCustomer(customer: Customer) {
    let index = this.customerList.indexOf(customer);
    this.customerListDeleted.push(customer);
    this.customerList = this.customerList.filter((val, i) => i != index);
  }

  formatCnpj(cnpj: any) {
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2")
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
    return cnpj;
  }
  formatDocument(doc: any) {
    if (this.holdingRegister?.type?.value === "PJ") {
      doc = doc.replace(/^(\d{2})(\d)/, "$1.$2")
      doc = doc.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      doc = doc.replace(/\.(\d{3})(\d)/, ".$1/$2");
      doc = doc.replace(/(\d{4})(\d)/, "$1-$2");
    } else if (this.holdingRegister?.type?.value === "PF") {
      doc = doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return doc;
  }

  applyHoldingTypeMask() {
    if (this.holdingRegister.cnpj.length == 11) {
      this.holdingRegister.type = this.holdingTypeList.find(type => type.value == PersonClassifierEnum.physical);
    } else if (this.holdingRegister.cnpj.length == 14) {
      this.holdingRegister.type = this.holdingTypeList.find(type => type.value == PersonClassifierEnum.legal);
    }
  }

  applyCustomerTypeMask() {
    if (this.customer.cnpj) {
      if (this.customer.cnpj.length == 11) {
        this.customer.type = this.holdingTypeList.find(type => type.value == PersonClassifierEnum.physical);
      } else if (this.customer.cnpj.length == 14) {
        this.customer.type = this.holdingTypeList.find(type => type.value == PersonClassifierEnum.legal);
      }
    }
  }

}
