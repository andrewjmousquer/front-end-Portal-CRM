import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { PersonClassificationDictionary } from 'src/app/shared/dictionary/person-classification.dictionary';
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { ContactEnum } from 'src/app/shared/enum/contact-enum';
import { MaskEnum } from 'src/app/shared/enum/mask-enum';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { PlaceholderEnum } from 'src/app/shared/enum/placeholder-enum';
import { ProposalPersonTypeEnum } from 'src/app/shared/enum/proposal-person-type-enum';
import { ProposalStatusEnum } from 'src/app/shared/enum/proposal-status-enum';
import { Channel } from 'src/app/shared/model/channel-model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Contact } from 'src/app/shared/model/contact.model';
import { PartnerGroup } from 'src/app/shared/model/partner-group.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { PersonHolding } from 'src/app/shared/model/person-holding.model';
import { Person } from 'src/app/shared/model/person.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProposalDetail } from 'src/app/shared/model/proposal-detail.dto';
import { ProposalList } from 'src/app/shared/model/proposal-list';
import { ProposalPerson } from 'src/app/shared/model/proposal-person';
import { ProposalSearch } from 'src/app/shared/model/proposal-search';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { PersonService } from 'src/app/shared/service/person.service';
import { ProposalService } from 'src/app/shared/service/proposal.service';
import { PersonUtil } from 'src/app/shared/util/person.util';
import { Utils } from 'src/app/shared/util/util';
import { ValidateUtil } from 'src/app/shared/util/validate.util';

@Component({
  selector: 'wbp-proposal-customer',
  templateUrl: './proposal-customer.component.html'
})
export class ProposalCustomerComponent implements OnInit {

  @Input() proposal: Proposal;
  @Input() registerForm: NgForm;
  @Input() channelList: Channel[];
  @Input() riskList: Classifier[];

  @Output() updateRegister: EventEmitter<Proposal> = new EventEmitter();

  isInitLoad: boolean = false;
  indexEditPerson: number;
  colsPerson: any[];
  colsPrevious: any[];
  maskEnum: any = MaskEnum;
  placeholderEnum: any = PlaceholderEnum;
  personHoldingRegister: PersonHolding;
  personClassifierEnum: any = PersonClassifierEnum;
  resume: ProposalDTO = new ProposalDTO();

  personList: Person[];
  customerTypeList: Classifier[];
  personClassificationList: Classifier[] = PersonClassificationDictionary;
  previousList: ProposalList[];
  partnerGroup: PartnerGroup[] = []

  personListCopy: ProposalPerson[] = [];
  displayModalPerson: boolean = false;
  displayModalPrevious: boolean = false;
  displayModalResume: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private personService: PersonService,
    private classifierService: ClassifierService,
    private proposalService: ProposalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.proposal = new Proposal();
    this.proposal.proposalDetail = new ProposalDetail();

    this.colsPerson = [
      { field: 'name', header: 'Cliente' },
      { field: 'identificador', header: 'Identificador' },
      { field: 'contact', header: 'Contatos' }
    ];
    this.colsPrevious = [
      { field: 'name', header: 'Proposta' },
      { field: 'name', header: 'Data da Proposta' },
      { field: 'name', header: 'Marca/Modelo' },
      { field: 'name', header: 'Parceiro' },
      { field: 'name', header: 'Status' },
    ];
    this.loadCustomerType();
  }

  ngOnChanges(): void {
    if (!this.proposal.personList || !this.proposal.personList.length) {
      this.proposal.personList = [];
    }

    this.proposal.personList.forEach(proposalPerson => {
      proposalPerson.person = PersonUtil.correctClassification(proposalPerson.person);
    });

    if (this.proposal && this.proposal.id && this.proposal.personList && this.proposal.personList.length) {
      if (!this.isInitLoad) {
        this.isInitLoad = true;
        this.proposal.personList.forEach(proposalPerson => {
          this.loadPreviousProposals(proposalPerson);
        });
      }

      this.proposal.personList.forEach(proposalPerson => {
        if (proposalPerson.person.contacts && proposalPerson.person.contacts.length) {
          let emails = proposalPerson.person.contacts.filter(contact => {
            return contact.type && contact.type.value == ContactEnum.EMAIL;
          });

          let phones = proposalPerson.person.contacts.filter(contact => {
            return contact.type && (contact.type.value == ContactEnum.TELEFONE || contact.type.value == ContactEnum.CELULAR);
          });

          proposalPerson.email = emails.length ? emails[0].value : '';
          proposalPerson.phone = phones.length ? phones[0].value : '';
        }
      });
    } else {
      // this.proposal.documentContact = true;
      // this.proposal.finantialContact = true;
    }
  }

  ngDoCheck(): void {
    this.updateRegister.emit(this.proposal);
  }

  loadPerson(proposalPerson: ProposalPerson) {
    const search = PersonUtil.getDocumentPerson(proposalPerson.person);
    this.personService.findByDocument(search).pipe(first()).subscribe(data => {
      this.buildPerson(proposalPerson, data);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPersonContact(proposalPerson: ProposalPerson, contact: string) {
    proposalPerson.person.contacts = proposalPerson.person.contacts || [];
    let email = proposalPerson.person.contacts.find(c => c.type.value == ContactEnum.EMAIL);
    let phone = proposalPerson.person.contacts.find(c =>
      c.type.value == ContactEnum.TELEFONE || c.type.value == ContactEnum.CELULAR);

    if (phone) {
      phone.value = proposalPerson.phone;
    } else {
      this.newContact(proposalPerson, ContactEnum.TELEFONE, proposalPerson.phone);
    }

    if (email) {
      email.value = proposalPerson.email;
    } else {
      this.newContact(proposalPerson, ContactEnum.EMAIL, proposalPerson.email);
    }

    // BUSCA DE PESSOAS COM O MESMO CONTATO
    this.personService.findByContact(contact).pipe(first()).subscribe(data => {
      if (data && data.length > 0) {
        if (data.length > 1) {
          this.personList = data;
          this.displayModalPerson = true;
        } else {
          if (proposalPerson.person.id != data[0].id) {
            this.personList = data;
            this.displayModalPerson = true;
          }
        }
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadCustomerType() {
    this.classifierService.searchByType(ClassifierEnum.CUSTOMER_TYPE).pipe(first()).subscribe(data => {
      this.customerTypeList = data;
      (!this.proposal.personList || !this.proposal.personList.length) && this.addProposalPerson();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPreviousProposals(proposalPerson: ProposalPerson) {
    let search = new ProposalSearch();
    search.name = proposalPerson.person.name;
    this.proposalService.search(search).pipe(first()).subscribe(data => {
      proposalPerson.previousProposals = data.filter(p => p.id !== this.proposal.id);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  getFilered(array: Proposal[]): Proposal[] {
    const result = [];
    array.forEach(each => {
      if (each.id != this.proposal.id)
        result.push(each);
    });
    return result;
  }

  buildPerson(proposalPerson: ProposalPerson, data: Person) {
    if (proposalPerson) {
      if (data) {
        proposalPerson.person = PersonUtil.correctClassification(data);
        proposalPerson.email = this.getContactValueByType(data.contacts, ContactEnum.EMAIL);
        proposalPerson.phone = this.getContactValueByType(data.contacts, ContactEnum.CELULAR);
        proposalPerson.phone = proposalPerson.phone || this.getContactValueByType(data.contacts, ContactEnum.TELEFONE);

        if (proposalPerson.person.negativeList) {
          this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Info', detail: `Não é possível confeccionar uma proposta para essa pessoa. Em caso de dúvidas, consulte o time Administrativo.` });
          console.log(this.messageService)
        }
        this.loadPreviousProposals(proposalPerson);
      } else if (proposalPerson.person && proposalPerson.person.id) {
        this.clearPerson(proposalPerson);
      }
    }
  }

  addProposalPerson() {
    let proposalPerson = new ProposalPerson();
    if (this.proposal.personList && this.proposal.personList.length) {
      this.customerTypeList.map(type => {
        let add = this.proposal.personList.find(person => {
          return person.proposalPersonClassification.id == type.id;
        });

        if (!add && !proposalPerson.proposalPersonClassification) {
          proposalPerson.proposalPersonClassification = type;
        }
      });
    } else {
      proposalPerson.proposalPersonClassification = this.customerTypeList.find(item => {
        return item.value == ProposalPersonTypeEnum.financier
      });
    }

    proposalPerson.person = new Person();
    proposalPerson.person.classification = PersonClassificationDictionary[0];
    this.proposal.personList.push(proposalPerson);
  }

  personModalDisabled(email: string) {
    return email && !ValidateUtil.isEmail(email);
  }

  onCompletePessoa($event, proposalPerson: ProposalPerson) {
    proposalPerson.person = $event;
    proposalPerson.person = PersonUtil.correctClassification(proposalPerson.person);

    if (proposalPerson.person.contacts) {
      proposalPerson.email = this.getContactValueByType(proposalPerson.person.contacts, ContactEnum.EMAIL);
      proposalPerson.phone = this.getContactValueByType(proposalPerson.person.contacts, ContactEnum.CELULAR);
      proposalPerson.phone = proposalPerson.phone || this.getContactValueByType(proposalPerson.person.contacts, ContactEnum.TELEFONE);
    }
  }

  getContactByType(contacts: Contact[], type: string) {
    const list = contacts.filter(c => {
      return c.type.value == type
    });
    return list.length ? list[0] : null;
  }

  getContactValueByType(contacts: Contact[], type: string) {
    const contact = this.getContactByType(contacts, type);
    return contact ? contact.value : null;
  }

  getPersonInitCustom(holding) {
    if (holding.person.contacts) {
      if (holding.phone) {
        let phone = this.getContactByType(holding.person.contacts, ContactEnum.CELULAR);
        phone = phone || this.getContactByType(holding.person.contacts, ContactEnum.TELEFONE);
        if (phone) {
          phone.value = holding.phone;
        } else {
          holding.person.contacts.push(this.getNewContactType(holding.phone, ContactEnum.CELULAR));
        }
      }

      if (holding.email) {
        let email = this.getContactByType(holding.person.contacts, ContactEnum.EMAIL);
        if (email) {
          email.value = holding.email;
        } else {
          holding.person.contacts.push(this.getNewContactType(holding.email, ContactEnum.EMAIL));
        }
      }
    } else {
      holding.person.contacts = [];
      if (holding.email) {
        holding.person.contacts.push(this.getNewContactType(holding.email, ContactEnum.EMAIL));
      }

      if (holding.phone) {
        holding.person.contacts.push(this.getNewContactType(holding.phone, ContactEnum.CELULAR));
      }
    }
  }

  getNewContactType(phone: string, type: string) {
    let classifier = new Classifier();
    classifier.type = type;

    let contact = new Contact();
    contact.value = phone;
    contact.type = classifier;
    return contact;
  }

  removeProposalPerson(key: number) {
    this.confirmationService.confirm({
      message: `Deseja remover este cliente?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.proposal.personList.splice(key, 1);
      }
    });
  }

  changeCannal() {
    this.proposal.proposalDetail.partner = new Partner;
  }

  changeClassification(proposalPerson: ProposalPerson) {
    this.proposal.finantialContact = false;
  }

  changeCustomerType(eventValue) {
    if (eventValue.proposalPersonClassification.value == ProposalPersonTypeEnum.financier) {
      let itens = this.proposal.personList.filter(p => { return p.proposalPersonClassification.value == ProposalPersonTypeEnum.financier });
      if (itens.length > 1) {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Info', detail: 'Só é permitido apenas um cliente com o papel Financiador!' });
        eventValue.proposalPersonClassification = null;
        event.stopPropagation();
      }
    }
  }

  changeImmediateDelivery() {
    if (this.proposal.immediateDelivery) {
      this.personListCopy = _.cloneDeep(this.proposal.personList);
      this.proposal.documentContact = true;
      this.proposal.finantialContact = true;
      this.proposal.personList = [];
      this.addProposalPerson();
    } else {
      if (this.personListCopy && this.personListCopy.length) {
        this.proposal.personList = _.cloneDeep(this.personListCopy);
      } else {
        this.proposal.personList = [];
        this.addProposalPerson();
      }
      this.proposal.personList.map(person => {
        person.person = PersonUtil.correctClassification(person.person, this.personClassificationList);
      });
    }
  }

  changeEmail(proposalPerson: ProposalPerson, index: number) {
    if (proposalPerson.email) {
      this.indexEditPerson = index;
      this.loadPersonContact(proposalPerson, proposalPerson.email);
    }
  }

  changePhone(proposalPerson: ProposalPerson, index: number) {
    if (proposalPerson.phone) {
      this.indexEditPerson = index;
      let phone = Utils.removeMask(proposalPerson.phone);
      this.loadPersonContact(proposalPerson, phone);
    }
  }

  changePerson(person: Person) {
    this.displayModalPerson = false;

    this.personService.getById(person.id).pipe(first()).subscribe(data => {
      let proposalPerson = this.proposal.personList[this.indexEditPerson];
      proposalPerson.person = data;
      proposalPerson.person.contacts = data.contacts || [];

      let email = proposalPerson.person.contacts.find(c => c.type.value == ContactEnum.EMAIL);
      let phone = proposalPerson.person.contacts.find(c =>
        c.type.value == ContactEnum.TELEFONE || c.type.value == ContactEnum.CELULAR);

      proposalPerson.email = email && email.value;
      proposalPerson.phone = phone && phone.value;
    });
  }

  changeDocumentContact() {
    if (this.proposal.documentContact) {
      this.proposal.documentContactName = null;
      this.proposal.documentContactEmail = null;
      this.proposal.documentContactPhone = null;
    }
  }

  changeFinantialContact() {
    if (this.proposal.finantialContact) {
      this.proposal.finantialContactName = null;
      this.proposal.finantialContactEmail = null;
      this.proposal.finantialContactPhone = null;
    }
  }

  openModalPrevious(proposalPerson: ProposalPerson) {
    this.displayModalPrevious = true;
    this.previousList = proposalPerson.previousProposals;
  }

  openModalResume(proposal: Proposal) {
    this.proposalService.getProposal(proposal.id).pipe(first()).subscribe(data => {
      this.displayModalResume = true;
      this.resume = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  openLead() {
    this.router.navigate(['/lead-form/']);
  }

  newContact(proposalPerson: ProposalPerson, type: string, value: string) {
    let contact = new Contact();
    this.classifierService.searchByValue(type).pipe(first()).subscribe(classifier => {
      if (classifier) {
        contact.type = classifier;
        contact.value = value;
        proposalPerson.person.contacts.push(contact);
        return;
      } else {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Info', detail: 'Erro ao preencher contato!' });
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  clearPerson(proposalPerson: ProposalPerson) {
    let keysPerson = Object.keys(proposalPerson.person);
    keysPerson.map(key => {
      if (['classification', 'cpf', 'cnpj', 'rne'].indexOf(key) < 0) {
        proposalPerson.person[key] = null;
      }
    });
    proposalPerson.email = '';
    proposalPerson.phone = '';
  }

  isShowContact() {
    let list = [
      ProposalStatusEnum.onCustomerApproval.toString(),
      ProposalStatusEnum.finishedWithoutSale.toString(),
      ProposalStatusEnum.finishedWithSale.toString(),
      ProposalStatusEnum.canceled.toString()
    ];
    return list.indexOf(this.proposal.status) >= 0;
  }
}
