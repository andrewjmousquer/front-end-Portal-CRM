import { Component, OnInit, ViewChild } from "@angular/core";
import * as _ from "lodash";

import { first } from "rxjs/operators";
import { MessageService } from "primeng/api";

import { PersonFormService } from "./person-form.service";
import { Person } from "src/app/shared/model/person.model";
import { PersonClassificationDictionary } from "src/app/shared/dictionary/person-classification.dictionary";
import { Classifier } from "src/app/shared/model/classifier.model";
import { AccountTypeDictionary } from "src/app/shared/dictionary/account-type.dictionary";
import { PersonQualification } from "src/app/shared/model/person-qualification.model";
import { Contact } from "src/app/shared/model/contact.model";
import { Qualification } from "src/app/shared/model/qualification.model";
import { Bank } from "src/app/shared/model/bank.model";
import { PersonRelatedDictionary } from "src/app/shared/dictionary/person-related.dictionary";
import { ContactEnum } from "src/app/shared/enum/contact-enum";
import { Country } from "src/app/shared/model/country.model";
import { State } from "src/app/shared/model/state.model";
import { City } from "src/app/shared/model/city.model";
import { AddressCep } from "src/app/shared/model/address-cep.model";
import { PersonClassifierEnum } from "src/app/shared/enum/person-classifier-enum";
import { CpfPipe } from "src/app/shared/pipe/cpf.pipe";
import { CnpjPipe } from "src/app/shared/pipe/cnpj.pipe";
import { NgForm } from "@angular/forms";
import { Address } from "src/app/shared/model/address.model";

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html'
})
export class PersonFormComponent implements OnInit {
  isEdit: boolean = false;
  isEditQuali: boolean = false;
  isEditBank: boolean = false;
  isEditRelated: boolean = false;
  tabViewIndex: number = 0;
  displayModalQuali: boolean = false;
  addressCep: AddressCep;
  readonlyCity = true;
  readonlyState = true;
  readonlyCountry = true;

  contactEnum: any = ContactEnum;
  personClassifierEnum: any = PersonClassifierEnum;

  personClassificationList: Classifier[] = PersonClassificationDictionary;

  qualificationList: Qualification[] = [];
  qualificationSelectedList: Qualification[] = [];
  bankList: Bank[] = [];
  contactList: Contact[] = [];
  countryList: Country[] = [];
  stateList: State[] = [];
  cityList: City[] = [];

  cols: any[];

  personList: any[] = new Array<any>();
  personSearch: Person;
  personRegister: Person = new Person();

  itemQualiRegister: PersonQualification = new PersonQualification();

  accountTypeList: Classifier[] = AccountTypeDictionary;
  PersonRelatedList: Classifier[] = PersonRelatedDictionary;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('personForm', { static: false }) personForm: NgForm;

  constructor(
    private messageService: MessageService,
    private personFormService: PersonFormService,
    private cpfPipe: CpfPipe,
    private cnpjPipe: CnpjPipe
  ) { }

  ngOnInit() {
    this.cols = [
      { field: 'classifier', header: '', class: 'column-small' },
      { field: 'cpf', header: 'Identificador' },
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'Email' },
      { field: 'telefone', header: 'Telefone' }
    ];

    this.resetSearchForm();
  }

  resetSearchForm() {
    this.personSearch = new Person();
    this.loadPerson(null);
  }

  resetRegisterForm() {
    this.personForm && this.personForm.form.reset({
      classification:  this.personClassificationList[0],
      city: new City(),
      state: new State()
    });

    this.personRegister = new Person();
    this.personRegister.classification = this.personClassificationList[0];
    this.personRegister.address = new Address();
    this.personRegister.address.city = new City();
    this.personRegister.address.city.state = new State();
    this.personRegister.address.city.state.country = new Country();
    this.personRegister.name = '';

    this.loadPerson(null);
  }

  loadPerson(event) {
    if (event && event.first) {
      this.personSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.personSearch.first = 0;
    }

    let method = this.personSearch && this.personSearch.name ? 'search' : 'getAll';
    this.personFormService[method](this.personSearch).pipe(first()).subscribe(data => {
      this.fillPersons(data);
    });
  }

  edit(id: number) {
    this.isEdit = true;
    this.personFormService.getById(id).pipe(first()).subscribe(data => {
      this.personRegister = data;
      this.tabViewIndex = 0;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  onComplete($event) {
    this.personRegister = $event;
  }

  fillPersons(data: Person[]) {
    this.personList = data;
    this.personList.forEach(person => {
      if (person.contacts && person.contacts.length > 0) {
        person.emails = person.contacts.find(c => c.type.value == ContactEnum.EMAIL)?.value;
        person.phones = person.contacts.find(c =>
          c.type.value == ContactEnum.CELULAR || c.type.value == ContactEnum.TELEFONE)?.value;
      }

      if (person.classification.value == PersonClassifierEnum.physical) {
        person.document = this.cpfPipe.transform(person.cpf);
      } else if (person.classification.value == PersonClassifierEnum.legal) {
        person.document = this.cnpjPipe.transform(person.cnpj);
      } else {
        person.document = person.rne;
      }
    });
  }
}
