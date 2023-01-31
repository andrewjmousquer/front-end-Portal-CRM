import { NgForm } from "@angular/forms";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import * as _ from "lodash";

import { first } from "rxjs/operators";
import { ConfirmationService, MessageService } from "primeng/api";

import { Person } from "src/app/shared/model/person.model";
import { PersonClassificationDictionary } from "src/app/shared/dictionary/person-classification.dictionary";
import { Classifier } from "src/app/shared/model/classifier.model";
import { BankAccount } from "src/app/shared/model/bank-account.model";
import { AccountTypeDictionary } from "src/app/shared/dictionary/account-type.dictionary";
import { Contact } from "src/app/shared/model/contact.model";
import { Address } from "src/app/shared/model/address.model";
import { Qualification } from "src/app/shared/model/qualification.model";
import { BankService } from "src/app/shared/service/bank.service";
import { Bank } from "src/app/shared/model/bank.model";
import { PersonRelated } from "src/app/shared/model/person-related.model";
import { MaskEnum } from "src/app/shared/enum/mask-enum";
import { ContactEnum } from "src/app/shared/enum/contact-enum";
import { Country } from "src/app/shared/model/country.model";
import { State } from "src/app/shared/model/state.model";
import { City } from "src/app/shared/model/city.model";
import { CountryService } from "src/app/shared/service/country.service";
import { StateService } from "src/app/shared/service/state.service";
import { CityService } from "src/app/shared/service/city.service";
import { AddressService } from "src/app/shared/service/address.service";
import { AddressCep } from "src/app/shared/model/address-cep.model";
import { Utils } from "src/app/shared/util/util";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Status } from "src/app/shared/model/status.model";
import { PersonFormService } from "src/app/page/person-form/person-form.service";
import { PersonDocumentEnum } from "src/app/shared/enum/person-document-enum";
import { PersonClassifierEnum } from "src/app/shared/enum/person-classifier-enum";
import { PersonUtil } from "src/app/shared/util/person.util";
import { ClassifierService } from "src/app/shared/service/classifier.service";
import { ClassifierEnum } from "src/app/shared/enum/classifier-enum";
import { RegExpEnum } from "src/app/shared/enum/regexp-enum";

@Component({
  selector: 'wbp-person-tab',
  templateUrl: './person-tab.component.html'
})

export class PersonTabComponent implements OnInit {

  @Input() personRegister: Person;
  @Input() resume: boolean;
  @Input() identification: boolean;
  @Input() contact: boolean;
  @Input() bank: boolean;
  @Input() address: boolean;
  @Input() related: boolean;
  @Input() isEdit: boolean;
  @Input() modal: boolean;
  @Input() negativeList: boolean;
  @Input() tabViewIndex: number;

  @Output() resetSearchForm: EventEmitter<any> = new EventEmitter();
  @Output() onComplete: EventEmitter<Person> = new EventEmitter();
  @Output() cancelModal: EventEmitter<any> = new EventEmitter();

  isNegativeList: boolean = false;
  isEditQuali: boolean = false;
  isEditBank: boolean = false;
  isEditRelated: boolean = false;
  displayModalQuali: boolean = false;
  isAddressAdded = false;
  addressCep: AddressCep;
  readonlyCity = true;
  readonlyState = true;
  readonlyCountry = true;

  contactEnum: any = ContactEnum;
  maskEnum: any = MaskEnum;
  regExpEnum: any = RegExpEnum;
  personDocumentEnum: any = PersonDocumentEnum;
  personClassifierEnum: any = PersonClassifierEnum;

  qualificationList: Qualification[] = [];
  qualificationSelectedList: Qualification[] = [];
  bankList: Bank[] = [];
  contactList: Contact[] = [];
  countryList: Country[] = [];
  stateList: State[] = [];
  cityList: City[] = [];

  colsPerson: any[];
  colsQualification: any[];
  colsContact: any[];
  colsBank: any[];
  colsRelated: any[];

  personList: Person[] = new Array<Person>();
  personSearch: Person;

  contactRegister: Contact = new Contact();
  bankAccountRegister: BankAccount = new BankAccount();
  personRelatedRegister: PersonRelated = new PersonRelated();
  personRelatedRegisterBkp: PersonRelated = new PersonRelated();

  personClassificationList: Classifier[] = PersonClassificationDictionary;
  accountTypeList: Classifier[] = AccountTypeDictionary;
  personRelatedTypeList: Classifier[];
  negativeListList: Classifier[];

  selectedStatus: Status;
  selectedRelatedType: Classifier;
  selectedAccountType: Classifier;
  indexEdit: number = 0;

  @ViewChild('personRegisterForm', { static: false }) personRegisterForm: NgForm;

  constructor(
    private messageService: MessageService,
    private bankService: BankService,
    private countryService: CountryService,
    private stateService: StateService,
    private cityService: CityService,
    private addressService: AddressService,
    private personFormService: PersonFormService,
    private classifierService: ClassifierService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.colsQualification = [
      { field: 'brand', header: 'Qualificações' },
      { field: 'model', header: 'Observação' }
    ];

    this.colsContact = [
      { field: 'brand', header: 'Meio de Contato' },
      { field: 'model', header: 'Contato' }
    ];

    this.colsBank = [
      { field: 'bank.name', header: 'Banco' },
      { field: 'agency', header: 'Agência' },
      { field: 'accountNumber', header: 'Conta' },
      { field: 'type', header: 'Tipo de Conta' }
    ];

    this.colsRelated = [
      { field: 'name', header: 'Nome' },
      { field: 'relatedType', header: 'Relacionamento' },
      { field: 'birthdate', header: 'Data de Nascimento' }
    ];

    this.contactList = this.personRegister.contacts || [];
    this.personRegister.bankAccount = this.personRegister.bankAccount || [];

    this.resetRegisterForm(true);

    this.loadPersonTypeList();
    this.loadNegativeList();
    this.loadBank();
    this.loadCountry();
  }

  ngOnChanges() {
    this.resetRegisterFormInternal();
    this.resetTabViewIndex();
    this.initPerson();
  }

  initPerson() {
    if (this.personRegister && this.personRegister.id) {
      this.contactList = this.personRegister.contacts;

      if (this.personRegister.classification) {
        this.personRegister.classification = this.personClassificationList.filter(c => {
          return c.value == this.personRegister.classification.value
        })[0];
      }

      this.isNegativeList = false;
      if (this.personRegister.negativeList) {
        this.isNegativeList = true;
      }

      if (!this.personRegister.address || !this.personRegister.address.city) {
        this.resetAddressForm();
      } else {
        this.isAddressAdded = true;
        this.loadState();
      }
    } else {
      this.resetAddressForm();
      this.resetRegisterForm(false);
    }
  }

  loadPersonTypeList() {
    this.classifierService.searchByType(ClassifierEnum.PERSON_RELATED).pipe(first()).subscribe(data => {
      this.personRelatedTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadNegativeList() {
    this.classifierService.searchByType(ClassifierEnum.NEGATIVE_LIST).pipe(first()).subscribe(data => {
      this.negativeListList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPerson() {
    const searchText = PersonUtil.getDocumentPerson(this.personRegister);
    if (searchText && searchText !== 'false') {
      this.personFormService.findByDocument(searchText).pipe(first()).subscribe(data => {
        if (data && data != null) {
          this.confirmationService.confirm({
            message: `A pessoa ${data.name} já está cadastrada, deseja utilizar o cadastro existente?`,
            header: 'Descartar edição de pessoa?',
            acceptLabel: 'Confirmar',
            rejectLabel: 'Cancelar',
            accept: () => {
              this.personRegister = data;
              this.initPerson();
              this.complete(this.personRegister);
            },
            reject: () => {
              this.resetRegisterForm(true);
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

  loadPersonById(idPessoa: number) {
    this.personFormService.getById(idPessoa).pipe(first()).subscribe(data => {
      this.complete(data);
      this.personRegister = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadBank() {
    this.bankService.getAll().pipe(first()).subscribe(data => {
      this.bankList = data;
    });
  }

  loadCountry() {
    this.countryService.getAll().pipe(first()).subscribe(data => {
      this.countryList = data;
    });
  }

  loadState() {
    if (this.personRegister.address.city.state.country
      && this.personRegister.address.city.state.country.id) {
      this.stateService.getByCountry(this.personRegister.address.city.state.country).pipe(first()).subscribe(data => {
        this.stateList = data;
        if (this.addressCep) {
          let uf = this.addressCep.uf;
          let states = data.filter(function (state) {
            return state.abbreviation == uf;
          });
          if (states.length) {
            this.personRegister.address.city.state = states[0];
            this.loadCity();
          } else {
            this.readonlyState = false;
            this.readonlyCity = false;
          }
        } else if (this.personRegister.address.city.state) {
          this.loadCity();
        }
      });
    }
  }

  loadCity() {
    if (this.personRegister && this.personRegister.address && this.personRegister.address.city && this.personRegister.address.city.state &&
      this.personRegister.address.city.state.id && this.personRegister.address.city.state.id > 0) {
      this.cityService.getByState(this.personRegister.address.city.state).pipe(first()).subscribe(data => {
        this.cityList = data;
        if (this.addressCep) {
          // var citys = this.cityList.filter(city => { city.name == 'Brasília' });
          let cityName = Utils.removeAccents(this.addressCep.localidade);
          let citys = this.cityList.filter(function (city) {
            return city.name == cityName;
          });
          if (citys.length) {
            this.personRegister.address.city = citys[0];
          } else {
            this.readonlyCity = false;
          }
        }
      });
    }
  }

  loadAddressByCep() {
    this.isAddressAdded = false;

    let cep = Utils.removeMask(this.personRegister.address.zipCode);
    if (cep && cep.length == 8) {
      this.resetAddressForm();

      this.addressService.getByCep(cep).pipe(first()).subscribe(data => {
        if (!data.erro) {
          this.addressCep = data;
          this.personRegister.address.street = this.addressCep.logradouro;
          this.personRegister.address.city.state.country = this.countryList[0];
          this.loadState();
          this.isAddressAdded = true;
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'CEP não encontrado, verifique e tente novamente!' });
        }
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Erro ao buscar CEP!' });
      });
    };
  }

  resetRegisterForm(reset?: boolean) {
    if(reset){
      this.personRegisterForm && this.personRegisterForm.form.reset({
        classificationtab: this.personClassificationList[0],
        city: new City(),
        state: new State()
      });

      this.personRegister = new Person();

      this.contactList = [];
    }
    
    this.isNegativeList = false;
    this.isEdit = false;
    
    this.personRegister.classification = this.personClassificationList[0];
    this.personRegister.qualifications = [];
    this.personRegister.bankAccount = [];
    this.personRegister.personRelated = [];
    this.personRelatedRegister = new PersonRelated();
    this.personRelatedRegisterBkp = new PersonRelated();

    this.resetAddressForm();
    this.resetTabViewIndex();

    if (!reset) {
      this.resetAddressForm();
      this.contactList = [];
    }
  }

  resetAddressForm() {
    this.isAddressAdded = false;
    this.readonlyCity = true;
    this.readonlyState = true;
    this.readonlyCountry = true;

    this.personRegister.address = new Address();
    this.personRegister.address.zipCode = "";
    this.personRegister.address.city = new City();
    this.personRegister.address.city.state = new State();
    this.personRegister.address.city.state.country = new Country();
  }

  resetTabViewIndex() {
    let index = this.personRegister && this.personRegister.id ? 0 : 1;
    this.tabViewIndex = this.modal ? 0 : index;
  }

  resetRegisterFormInternal() {
    this.contactRegister = new Contact();
    this.contactRegister.type = new Classifier();
    this.bankAccountRegister = new BankAccount();
    this.selectedAccountType = new Classifier();
  }

  save() {
    if (!this.validateForm()) return false;
    if (!this.fillNegativeList()) return false;
    if (!this.fillDocument()) return false;
    if (!this.fillAddress()) return false;

    this.fillContacts();
    this.fillPersonRelated();
    this.fillBank();
    this.clearDocument();
    this.clearContacts();

    let method = this.personRegister.id ? 'update' : 'save';
    let message = this.personRegister.id ? 'atualizada' : 'adicionada';

    let personSave = _.cloneDeep(this.personRegister);

    if (!this.isAddressAdded) {
      personSave.address = null;
    }

    this.personFormService[method](personSave).pipe(first()).subscribe(data => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Salvo com sucesso',
        detail: `Pessoa ${message} com sucesso!`
      });

      this.resetRegisterForm(true);

      if (this.modal) {
        this.complete(data);
      }

      this.resetSearchForm.emit();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  validateForm(): boolean {
    if (!this.personRegisterForm.valid) {
      this.messageService.add({
        key: 'tst', severity: 'error', summary: 'Erro',
        detail: `Preencha os campos obrigatórios marcado "*"!`
      });
      return false;
    }

    return true;
  }

  fillNegativeList(): boolean {
    if (this.isNegativeList) {
      if (!this.personRegister.negativeList) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Selecione o motivo da Lista Negativa!` });
        return false;
      }
    } else {
      this.personRegister.negativeList = null;
    }

    return true;
  }

  fillDocument(): boolean {
    let valid = false;
    let document = '';

    if (this.personRegister.classification == this.personClassifierEnum.physical && !cpf.isValid(this.personRegister.cpf)) {
      document = 'CPF';
    } else if (this.personRegister.classification == this.personClassifierEnum.legal && !cnpj.isValid(this.personRegister.cnpj)) {
      document = 'CNPJ';
    } else {
      valid = true;
    }

    if (!valid) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O campo ${document} é inválido!` });
    }
    return valid;
  }

  fillAddress(): boolean {
    if (this.isAddressAdded) {
      if (!this.personRegister.address.street || !this.personRegister.address.city || !this.personRegister.address.number) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Para cadastro de endereço os campos CEP, Endereço, Cidade, Estado, País e Número são obrigatórios!` });
        return false;
      }

      if (this.personRegister.address.zipCode) {
        this.personRegister.address.zipCode = Utils.removeMask(this.personRegister.address.zipCode);
      }
    }

    return true;
  }

  fillContacts() {
    if (this.contactList && this.contactList.length > 0) {
      this.personRegister.contacts = this.contactList;
    }
  }

  fillPersonRelated() {
    if (this.personRegister.personRelated && this.personRegister.personRelated.length > 0) {
      this.personRegister.personRelated.map(p => {

      });
    }
  }

  fillBank() {
    if (this.personRegister.bankAccount && this.personRegister.bankAccount.length > 0) {
      this.personRegister.bankAccount.map(b => {
      });
    }
  }

  clearDocument() {
    this.personRegister.cpf = Utils.removeMask(this.personRegister.cpf);
    this.personRegister.cnpj = Utils.removeMask(this.personRegister.cnpj);

    if (this.personRegister.classification.value == this.personClassifierEnum.physical) {
      this.personRegister.cnpj = null;
      this.personRegister.rne = null;
    } else if (this.personRegister.classification.value == this.personClassifierEnum.legal) {
      this.personRegister.cpf = null;
      this.personRegister.rne = null;
    } else {
      this.personRegister.cnpj = null;
      this.personRegister.cpf = null;
    }
  }

  clearContacts() {
    if (this.personRegister.contacts) {
      this.personRegister.contacts.map(contact => {
        if (contact.type.value == this.contactEnum.CELULAR
          || contact.type.value == this.contactEnum.TELEFONE) {
          contact.value = Utils.removeMask(contact.value);
        }
        return contact;
      });
    }
  }


  refreshContactList(contacts: Contact[]) {
    this.contactList = contacts;
  }

  remove(person: Person) {
    this.confirmationService.confirm({
      message: `Deseja remover ${person.name}?`, header: 'Excluir registro',
      accept: () => {
        this.personFormService.delete(person.id).pipe(first()).subscribe(data => {
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Removido com Sucesso!',
            detail: 'Registro removido com sucesso!'
          });

          this.resetSearchForm.emit();
        }, error => {
          this.messageService.add({
            key: 'tst', severity: 'error', summary: 'Erro',
            detail: error
          });
        });
      }
    });
  }

  // bank
  resetBankRegisterForm() {
    this.isEditBank = false;
    this.bankAccountRegister = new BankAccount();
  }

  saveBank() {
    if (this.bankAccountRegister.bank
      && this.bankAccountRegister.agency
      && this.bankAccountRegister.accountNumber
      && (this.selectedAccountType && this.selectedAccountType.id != null && this.selectedAccountType.id > 0)) {
      this.bankAccountRegister.type = this.selectedAccountType.type;
      this.personRegister.bankAccount = this.personRegister.bankAccount || [];
      this.personRegister.bankAccount.push(this.bankAccountRegister);
      this.personRegister.bankAccount = [...this.personRegister.bankAccount];
      this.bankAccountRegister = new BankAccount();
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Os campos Banco, Agência, Conta e Tipo de Conta são obrigatórios!' });
    }
  }

  editBank(bankAccount: BankAccount) {
    this.isEditBank = true;
    this.selectedAccountType = this.accountTypeList.filter(item => item.type == this.bankAccountRegister.type)[0];
    this.personRegister.bankAccount = [...this.personRegister.bankAccount];
  }

  removeBank(bankAccount: BankAccount) {

    this.confirmationService.confirm({
      message: `Deseja remover ${bankAccount.bank.name} - Agência: ${bankAccount.agency}  Conta: ${bankAccount.accountNumber} ?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        let index = this.personRegister.bankAccount.indexOf(bankAccount);
        this.personRegister.bankAccount.splice(index, 1);
        this.personRegister.bankAccount = [...this.personRegister.bankAccount]
      }
    });
  }

  // related
  resetRelatedRegisterForm() {
    this.isEditRelated = false;
    this.personRelatedRegister = new PersonRelated();
  }

  saveRelated() {
    if (this.personRelatedRegister.name
      && this.personRelatedRegister.relatedType
      && this.personRelatedRegister.birthdate) {
      this.personRegister.personRelated.push(this.personRelatedRegister);
      this.personRegister.personRelated = [...this.personRegister.personRelated];
      this.personRelatedRegister = new PersonRelated();
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Os campos nome, relacionamento e Data de Nascimento são obrigatórios!' });
    }
  }

  editRelated(event) {
    if (this.isEditRelated == true) {
      this.personRegister.personRelated.push(this.personRelatedRegisterBkp);
      this.personRelatedRegisterBkp = null;
    }

    this.personRelatedRegister.birthdate = new Date(this.personRelatedRegister.birthdate);

    let personRelated = event.data;
    this.isEditRelated = true;
    this.indexEdit = this.personRegister.personRelated.indexOf(personRelated);
    this.personRelatedRegisterBkp = _.clone(this.personRelatedRegister);
    this.personRegister.personRelated = this.personRegister.personRelated.filter((val, i) => i != this.indexEdit);
  }

  removeRelated(key: number) {
    this.personRegister.personRelated.splice(key, 1);
    this.personRegister.personRelated = [...this.personRegister.personRelated];
  }

  complete(person: Person) {
    this.onComplete.emit(person);
  }

  cancel() {
    this.cancelModal.emit();
  }
}
