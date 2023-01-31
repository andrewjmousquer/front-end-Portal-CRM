import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as _ from "lodash";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClassifierService } from '../../service/classifier.service';
import { Contact } from '../../model/contact.model';
import { Classifier } from '../../model/classifier.model';
import { Utils } from '../../../shared/util/util';
import { ContactEnum } from '../../../shared/enum/contact-enum';
import { ClassifierEnum } from '../../enum/classifier-enum';

@Component({
  selector: 'wbp-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  loading: boolean = false;
  isEdit: boolean = false;
  isContactPhone = false;
  isContactEmail = false;
  isContactMobile = false;
  indexEdit: number = 0;

  cols: any[];
  componentContactBackup: Contact;
  @Input() componentContact: Contact;
  @Input() componentContactList: Contact[];
  @Input() horizontal: boolean = false;

  @Output() refreshContactList: EventEmitter<Contact[]> = new EventEmitter();

  contactTypeList: Classifier[] = [];

  util: Utils = new Utils();

  @ViewChild('contactForm', { static: false }) contactForm: NgForm;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private classifierService: ClassifierService) { }

  ngOnInit() {
    this.cols = [
      { field: 'type', header: 'Tipo' },
      { field: 'value', header: 'Contato' },
      { field: 'complement', header: 'Complemento' }
    ];

    this.resetContactForm();
    this.componentContactList = this.componentContactList || [];

    this.classifierService.searchByType(ClassifierEnum.CONTACT_TYPE).pipe(first()).subscribe(data => {
      this.contactTypeList = data;
      this.contactTypeList.map(contact => {
        contact.label = Utils.titlecase(contact.value);
        return contact;
      });
    });
  }

  ngOnChanges() {
    if (this.contactTypeList && this.componentContactList) {
      this.componentContactList.map(contact => {
        const types = this.contactTypeList.filter(ctype => {
          return ctype.value == contact.type.type
            || ctype.value == contact.type.value;
        });
        contact.type = types.length ? types[0] : contact.type;
        return contact;
      });
    }
  }

  changeContactType() {
    this.isContactEmail = false;
    this.isContactPhone = false;
    this.isContactMobile = false;

    if (this.componentContact.type.value?.toUpperCase() == ContactEnum.EMAIL) {
      this.isContactEmail = true;
    } else if (this.componentContact.type.value?.toUpperCase() == ContactEnum.CELULAR) {
      this.isContactMobile = true;
    } else if (this.componentContact.type.value?.toUpperCase() == ContactEnum.TELEFONE) {
      this.isContactPhone = true;
    }
  }

  resetContactForm() {
    this.isEdit = false;
    this.indexEdit = null;
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
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro ao adicionar contato', detail: 'Selecione um tipo de contato!' });
      return;
    }

    if (!this.componentContact.value) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro ao adicionar contato', detail: 'Digite o contato!' });
      return;
    }

    this.componentContactList = this.componentContactList || [];

    if (this.componentContactList.length > 0) {
      this.componentContactList.forEach((item, index) => {
        if ((item.value == this.componentContact.value && item.type.value == this.componentContact.type.value && item.complement== this.componentContact.complement )
          && this.indexEdit != index) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Contato existente', detail: 'Esse contato já existe' });
          valid = false;
        }
      });
    }

    if (valid) {
      if (this.isEdit) {
        this.componentContactList[this.indexEdit] = this.componentContact;
      } else {
        this.componentContactList.push(this.componentContact);
      }
      this.resetContactForm();
    }
    this.componentContactList = [...this.componentContactList];

    this.refreshContactList.emit(this.componentContactList);
  }

  editContact(event) {
    let contact = event.data;
    this.isEdit = true;
    this.indexEdit = this.componentContactList.indexOf(contact);
    this.componentContact = _.clone(contact);
    this.changeContactType();
    // this.componentContactList = this.componentContactList.filter((val, i) => i != index);
  }

  removeContact(contact: Contact) {
    this.confirmationService.confirm({
      message: `Deseja remover ${contact.value}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        let index = this.componentContactList.indexOf(contact);
        this.componentContactList.splice(index, 1);
        this.componentContactList = [...this.componentContactList];
        this.refreshContactList.emit(this.componentContactList);
      }
    });
  }
}
