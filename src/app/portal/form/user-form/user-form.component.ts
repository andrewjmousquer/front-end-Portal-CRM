import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserFormService } from './user-form.service';
import { AccessListService } from '../../../shared/service/access-list.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ClassifierService } from '../../../shared/service/classifier.service';
import { CustomerService } from '../../../shared/service/customer.service';
import { UserService } from '../../../shared/service/user.service';

import { User } from '../../../shared/model/user.model';
import { AccessList } from '../../../shared/model/access-list.model';
import { Contact } from '../../../shared/model/contact.model';
import { Classifier } from '../../../shared/model/classifier.model';
import { Customer } from '../../../shared/model/customer.model';
import { Person } from '../../../shared/model/person.model';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { PersonUtil } from 'src/app/shared/util/person.util';
import { PersonFormService } from 'src/app/page/person-form/person-form.service';
import { PersonClassificationDictionary } from 'src/app/shared/dictionary/person-classification.dictionary';
import { Utils } from 'src/app/shared/util/util';

import { ContactEnum } from 'src/app/shared/enum/contact-enum';
import { MaskEnum } from 'src/app/shared/enum/mask-enum';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { PersonDocumentEnum } from 'src/app/shared/enum/person-document-enum';
import { PersonService } from 'src/app/shared/service/person.service';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'wbp-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  isEdit = false;

  accessListList: AccessList[];
  contactList: Contact[];
  contactTypeList: Classifier[];
  personTypeList: Classifier[];
  customerList: Customer[];
  customerAvailableList: Customer[];
  customerSelectedList: Customer[];
  userList: User[];
  selectedUserList: User[];
  userTypeList: Classifier[];
  items: MenuItem[];
  cols: any[];

  email: string;

  maskEnum: any = MaskEnum;
  personDocumentEnum: any = PersonDocumentEnum;
  personClassifierEnum: any = PersonClassifierEnum;
  personClassificationList: Classifier[] = PersonClassificationDictionary;

  home: MenuItem;
  userSearch: User;
  userRegister: User;

  @ViewChild('userRegisterForm', { static: false }) userRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userFormService: UserFormService,
    private accessListService: AccessListService,
    private classifierService: ClassifierService,
    private customerService: CustomerService,
    private personService: PersonService,
    private userService: UserService) { }

  ngOnInit() {

    this.cols = [
      { field: 'username', header: 'Usuário' },
      { field: 'person', header: 'Nome' },
      { field: 'userType', header: 'Tipo' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
    this.loadCombos();
  }

  loadCombos() {
    this.userService.getAll().pipe(first()).subscribe(data => {
      this.userList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.accessListService.getAll().pipe(first()).subscribe(data => {
      this.accessListList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.classifierService.searchByType("CONTACT_TYPE").pipe(first()).subscribe(data => {
      this.contactTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.customerService.getAll().pipe(first()).subscribe(data => {
      this.customerList = data;
      this.customerAvailableList = this.customerList;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.classifierService.searchByType("USER_TYPE").pipe(first()).subscribe(data => {
      this.userTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.classifierService.searchByType(ClassifierEnum.PERSON_CLASSIFICATION).pipe(first()).subscribe(data => {
      this.personTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.classifierService.searchByType(ClassifierEnum.CONTACT_TYPE).pipe(first()).subscribe(data => {
      this.contactTypeList = data;
      this.contactTypeList.map(contact => {
        contact.label = Utils.titlecase(contact.value);
        return contact;
      });
    });
  }

  resetSearchForm() {
    this.userSearch = new User();
    this.userSearch.person = new Person();
    this.userSearch.userType = new Classifier();
    this.userSearch.customer = new Customer();

    this.loadCombos();
  }

  search(event) {
    if (event && event.first) {
      this.userSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.userSearch.first = 0;
    }
    this.userFormService.search(this.userSearch).pipe(first()).subscribe(data => {
      this.userList = data;
    });
  }

  edit(event) {
    this.isEdit = true;

    this.userFormService.getById(this.userRegister.id).pipe(first()).subscribe(data => {
      this.userRegister = data;

      if (this.userRegister.customers) {
        this.customerAvailableList = [];
        this.customerSelectedList = this.userRegister.customers;

        this.customerList.forEach(itemBD => {
          let insertItem: boolean = true;
          this.customerSelectedList.forEach(itemView => {
            if (insertItem == true) {
              if (itemBD.id == itemView.id) {
                insertItem = false;
              }
            }
          })
          if (insertItem == true) {
            this.customerAvailableList.push(itemBD);
          }
        });
      }

      if (this.userRegister.person.contacts) {
        this.contactList = this.userRegister.person.contacts;

        this.contactList.forEach( contact => {
          if(contact.type.value == ContactEnum.EMAIL){
            this.email = contact.value;
          }
        });
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(user: User) {
    this.confirmationService.confirm({
      message: `Deseja remover ${user.username}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.userFormService.delete(user.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
          this.userRegisterForm.reset();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    let valid = true;
    if (this.userRegister.changePass == true || this.isEdit == false) {
      if (this.userRegister.password == "" || this.userRegister.password == undefined || this.userRegister.password == null ||
        this.userRegister.confirmPassword == "" || this.userRegister.confirmPassword == undefined || this.userRegister.confirmPassword == null) {
        this.messageService.add({ key: 'tst', severity: 'info', summary: 'Senha', detail: 'É necessário digitar uma senha!' });
        valid = false;
      } else if (this.userRegister.password != this.userRegister.confirmPassword) {
        this.messageService.add({ key: 'tst', severity: 'info', summary: 'Senha', detail: 'As senhas devem ser iguais!' });
        valid = false;
      }
    }

    if (!this.contactList){
      this.contactList = new Array<Contact>();
    } else {
      let existEmail: boolean = false;
      this.contactList.forEach( contact => {
        if(contact.type.value == ContactEnum.EMAIL){
          contact.value = this.email;
          existEmail = true;
        }
      });

      if(!existEmail){
        let contactEmail = new Contact();
        contactEmail.value = this.email;
        contactEmail.type = this.contactTypeList.find( val => val.value == ContactEnum.EMAIL);
        this.contactList.push(contactEmail);
      }
    }

    this.userRegister.person.contacts = this.contactList;

    if (this.customerSelectedList != null) {
      if (this.customerSelectedList.length > 0) {
        this.userRegister.customers = this.customerSelectedList;
      }
    }

    if(!this.userRegister.userType){
      this.messageService.add({ key: 'tst', severity: 'info', summary: 'Tipo de Usuário', detail: 'Selecione o tipo de usuário!' });
      valid = false;
    }

    if (valid) {
      let method = this.userRegister.id ? 'update' : 'save';
      let message = this.userRegister.id ? 'atualizado' : 'adicionado';

      this.userFormService[method](this.userRegister).pipe(first()).subscribe(data => {
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
    }
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.userRegister = new User();
    this.userRegister.person = new Person();
    this.userRegister.person.classification = new Classifier();
    this.userRegister.person.name = "";

    this.userRegister.customers = [];
    this.customerSelectedList = [];
    this.customerAvailableList = this.customerList;

    this.contactList = [];
    this.email = null;

    this.userRegisterForm && this.userRegisterForm.reset();

    this.loadPersonClassificationList();// Necessário load pois acima resetamos modelRegister.person

    if(this.personClassificationList && this.personClassificationList.length > 0){
      this.userRegister.person.classification = this.personClassificationList.find( x =>
        x.value == PersonClassifierEnum.physical);
    }
  }

  resetPerson(){
    this.userRegister.person = new Person();
    this.userRegister.person.classification = new Classifier();
    this.userRegister.person.name = "";

    this.userRegisterForm && this.userRegisterForm.reset();


    if(this.userRegister && this.userRegister.person){
      this.userRegister.person.classification = this.personClassificationList.find( personType => personType.value === PersonClassifierEnum.physical);
    }
  }

  loadPerson() {
    const searchText = PersonUtil.getDocumentPerson(this.userRegister.person);
    if (searchText && searchText !== 'false' && searchText !== 'null') {
      this.personService.findByDocument(searchText).pipe(first()).subscribe(data => {
        if (data && data != null) {
          if((data.user && this.isEdit && this.userRegister.person.id !== data.id) || (data.user && !this.isEdit) ){
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail:  `Não é possível prosseguir pois a pessoa ${data.name} já possui um usuário cadastrado!` });
            this.resetPerson();
            return;
          }

          if(this.userRegister.person.id !== data.id){
            this.confirmationService.confirm({
              message: `A pessoa ${data.name} já está cadastrada, deseja utilizar o cadastro existente?`,
              header: 'Descartar edição de funcionário?',
              acceptLabel: 'Confirmar',
              rejectLabel: 'Cancelar',
              accept: () => {
                this.userRegister.person = data;

                if(this.userRegister.person && this.userRegister.person.contacts && this.userRegister.person.contacts.length > 0){
                  this.userRegister.person.contacts.forEach( data => {
                    if(data.type.value == ContactEnum.EMAIL){
                      this.email = data.value;
                    }
                  })
                }

              },
              reject: () => {
                this.resetPerson();
              }
            });
          }
        }
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else if(searchText == 'false') {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Informe um número de documento válido!' });
    }
  }

  loadPersonClassificationList() {
    this.classifierService.searchByType(ClassifierEnum.PERSON_CLASSIFICATION).pipe(first()).subscribe(data => {
      this.personClassificationList = data;

      if(this.userRegister && this.userRegister.person){
        this.userRegister.person.classification = this.personClassificationList.find( personType => personType.value === PersonClassifierEnum.physical);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  onCompletePerson(person: Person) {
    this.userRegister.person = person;
  }

}
