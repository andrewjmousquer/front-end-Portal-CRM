import { NgForm } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { first } from "rxjs/operators";
import * as _ from "lodash";

import { ConfirmationService, MessageService } from "primeng/api";

import { MaskEnum } from "src/app/shared/enum/mask-enum";
import { SellerFormService } from "./seller-form.service";
import { Seller } from "src/app/shared/model/seller.model";
import { Classifier } from "src/app/shared/model/classifier.model";
import { Person } from "src/app/shared/model/person.model";
import { PersonService } from "src/app/shared/service/person.service";
import { ClassifierService } from "src/app/shared/service/classifier.service";
import { ClassifierEnum } from "src/app/shared/enum/classifier-enum";
import { SalesTeamService } from "src/app/shared/service/sales-team.service";
import { SalesTeam } from "src/app/shared/model/sales-team.model";
import { Utils } from "src/app/shared/util/util";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { PersonDocumentEnum } from "src/app/shared/enum/person-document-enum";
import { Partner } from "src/app/shared/model/partner.model";
import { PartnerFormService } from "../partner-form/partner-form.service";
import { Job } from "src/app/shared/model/job.model";
import { JobService } from "src/app/shared/service/job.service";
import { PartnerGroup } from "src/app/shared/model/partner-group.model";
import { PartnerGroupFormService } from "../partner-group-form/partner-group-form.service";
import { PersonClassifierEnum } from "src/app/shared/enum/person-classifier-enum";
import { User } from "src/app/shared/model/user.model";
import { UserService } from "src/app/shared/service/user.service";
import { PersonUtil } from "src/app/shared/util/person.util";
import { PersonClassificationDictionary } from "src/app/shared/dictionary/person-classification.dictionary";

@Component({
  selector: 'app-seller-form',
  templateUrl: './seller-form.component.html'
})
export class SellerFormComponent implements OnInit {
  isEdit: boolean = false;
  cols: any[];

  modelList: Seller[];
  modelSearch: Seller;
  modelRegister: Seller;

  jobList: Job[];
  personTypeList: Classifier[];
  userList: User[] = [];
  maskEnum: any = MaskEnum;

  salesTeamList: SalesTeam[];
  salesTeamAvailableList: SalesTeam[];
  salesTeamSelectedList: SalesTeam[];

  partnerGroupList: PartnerGroup[];
  partnerSearch: Partner;
  partnerList: Partner[];
  partnerAvailableList: Partner[];
  partnerSelectedList: Partner[];

  agentSearch: Seller;
  agentList: Seller[];
  agentAvailableList: Seller[];
  agentSelectedList: Seller[];

  userSelected: User;

  personClassifierEnum: any = PersonClassifierEnum;
  personDocumentEnum: any = PersonDocumentEnum;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('registerForm', { static: false }) registerForm: NgForm;

  constructor(
    private messageService: MessageService,
    private sellerFormService: SellerFormService,
    private confirmationService: ConfirmationService,
    private jobService: JobService,
    private personService: PersonService,
    private classifierService: ClassifierService,
    private salesTeamService: SalesTeamService,
    private partnerService: PartnerFormService,
    private userService: UserService,
    private partnerGroupService: PartnerGroupFormService) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'jobTitle', header: 'Cargo' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();

    this.loadUsers();
    this.loadJobs();
    this.loadPersonType();
    this.loadSalesTeam();
    this.loadPartners();
    this.loadPartnerGroup();
    this.loadSellersAgent();
  }

  loadSellers() {
    this.sellerFormService.getAll().pipe(first()).subscribe(data => {
      this.modelList = data;
    });
  }

  search(event) {
    if (event && event.first) {
      this.modelSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.modelSearch.first = 0;
    }

    if( this.modelSearch.person !== null && this.modelSearch.person.name !== undefined && this.modelSearch.person.name !== "" ) {
      this.sellerFormService.search(this.modelSearch.person.name).pipe(first()).subscribe(data => {
        this.modelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.sellerFormService.getAll().pipe(first()).subscribe(data => {
        this.modelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  loadPerson() {
    const searchText = this.getDocumentPerson();
    if (searchText && searchText !== 'false') {
      this.personService.findByDocument(searchText).pipe(first()).subscribe(data => {
        if (data && data != null) {
          this.modelRegister.person = data;
        }
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Informe um número de documento válido!' });
    }
  }

  loadPersonType() {
    this.classifierService.searchByType(ClassifierEnum.PERSON_CLASSIFICATION).pipe(first()).subscribe(data => {
      this.personTypeList = data;

      if (this.modelRegister && this.modelRegister.person) {
        this.modelRegister.person.classification = this.personTypeList.find(personType => personType.value === "PF");
      }

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadSalesTeam() {
    this.salesTeamService.getAll().pipe(first()).subscribe(data => {
      this.salesTeamList = data;
      this.salesTeamAvailableList = _.clone(this.salesTeamList);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadUsers() {
    this.userService.getAll().pipe(first()).subscribe(data => {
      this.userList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadJobs() {
    this.jobService.getAll().pipe(first()).subscribe(data => {
      this.jobList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPartnerGroup() {
    this.partnerGroupService.getAll().pipe(first()).subscribe(data => {
      this.partnerGroupList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPartners() {
    this.partnerService.getAll().pipe(first()).subscribe(data => {
      this.partnerList = data;
      this.partnerList.sort((a, b) => (a.person.name < b.person.name ? -1 : 1));
      this.partnerAvailableList = _.clone(this.partnerList);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadSellersAgent() {
    this.sellerFormService.getAll().pipe(first()).subscribe(data => {
      this.agentList = data;
      this.agentAvailableList = _.clone(this.agentList);

      this.removeLoggedAggentFromlist();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.modelSearch = new Seller();
    this.modelSearch.person = new Person();
    this.loadSellers();
  }

  resetRegisterForm() {
    this.registerForm && this.registerForm.reset();

    this.isEdit = false;
    this.modelRegister = new Seller();
    this.modelRegister.person = new Person();
    this.modelRegister.person.classification = new Classifier();

    if (this.personTypeList && this.personTypeList.length > 0) {
      this.modelRegister.person.classification = this.personTypeList.find(personType => personType.value === "PF");
    }

    this.userSelected = new User();

    this.salesTeamAvailableList = _.clone(this.salesTeamList);
    this.salesTeamSelectedList = [];

    this.partnerSearch = new Partner();
    this.partnerSearch.person = new Person();
    this.partnerSearch.partnerGroup = new PartnerGroup();
    this.partnerAvailableList = _.clone(this.partnerList);
    this.partnerSelectedList = [];

    this.agentSearch = new Seller();
    this.agentSearch.person = new Person();
    this.agentSelectedList = [];

    // this.loadSellersAgent();
  }

  edit() {
    this.isEdit = true;
    this.sellerFormService.getById(this.modelRegister.id).pipe(first()).subscribe(data => {
      this.modelRegister = data;
      this.userSelected = this.modelRegister.user;
      this.fillSalesTeamToEdit();
      this.fillPartnersToEdit();
      this.fillAgentsToEdit();

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  fillSalesTeamToEdit() {
    if (this.modelRegister.salesTeamList) {
      this.salesTeamAvailableList = [];
      this.salesTeamSelectedList = this.modelRegister.salesTeamList;

      this.salesTeamList.forEach(itemBD => {
        let insertItem: boolean = true;
        this.salesTeamSelectedList.forEach(itemView => {
          if (insertItem == true) {
            if (itemBD.id == itemView.id) {
              insertItem = false;
            }
          }
        })

        if (insertItem == true) {
          this.salesTeamAvailableList.push(itemBD);
        }
      });
    } else {
      this.salesTeamAvailableList = this.salesTeamList;
    }
  }

  fillPartnersToEdit() {
    if (this.modelRegister.partnerList) {
      this.partnerAvailableList = [];
      this.partnerSelectedList = this.modelRegister.partnerList;

      this.partnerList.forEach(itemBD => {
        let insertItem: boolean = true;
        this.partnerSelectedList.forEach(itemView => {
          if (insertItem == true) {
            if (itemBD.id == itemView.id) {
              insertItem = false;
            }
          }
        })

        if (insertItem == true) {
          this.partnerAvailableList.push(itemBD);
        }
      });
    } else {
      this.partnerAvailableList = this.partnerList;
    }
  }

  fillAgentsToEdit() {
    if (this.modelRegister.agentList) {
      this.agentAvailableList = [];
      this.agentSelectedList = this.modelRegister.agentList;

      this.agentList.forEach(itemBD => {
        let insertItem: boolean = true;
        this.agentSelectedList.forEach(itemView => {
          if (insertItem == true) {
            if (itemBD.id == itemView.id) {
              insertItem = false;
            }
          }
        })

        if (insertItem == true) {
          this.agentAvailableList.push(itemBD);
        }
      });
    } else {
      this.agentAvailableList = this.agentList;
    }

    this.removeLoggedAggentFromlist();
  }

  removeLoggedAggentFromlist() {
    //REMOVE O SELLER QUE ESTA SENDO EDITADO PARA NÃO ADICIONÁ-LO COMO PRÓPRIO AGENTE
    this.agentAvailableList = this.agentAvailableList.filter(item => item.id !== this.modelRegister.id);
  }

  remove(seller: Seller) {
    this.confirmationService.confirm({
      message: `Deseja remover ${seller.person.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.sellerFormService.delete(seller.id).pipe(first()).subscribe(data => {
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Removido com sucesso',
            detail: 'Registro removido com sucesso!'
          });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    let method = this.modelRegister.id ? 'update' : 'save';
    let message = this.modelRegister.id ? 'atualizado' : 'adicionado';

    if (this.salesTeamSelectedList != null && this.salesTeamSelectedList.length > 0) {
      this.modelRegister.salesTeamList = this.salesTeamSelectedList;
    }

    if (this.partnerSelectedList != null && this.partnerSelectedList.length > 0) {
      this.modelRegister.partnerList = this.partnerSelectedList;
    }

    this.sellerFormService[method](this.modelRegister).pipe(first()).subscribe(data => {
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

  onChangeUser(event) {
    this.modelRegister.person = event.value.person;
    this.personService.getById(this.modelRegister.person.id).pipe(first()).subscribe(data => {
      if (data && data != null) {
        this.modelRegister.person = data;
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.modelRegister.person.classification = this.modelRegister.person.classification || PersonClassificationDictionary[0];
    PersonUtil.correctClassification(event.value.person);
  }

  onCompletePerson(person: Person) {
    this.modelRegister.person = person;
    this.loadPerson();
    this.loadUsers();
    this.search(null);
  }

  getDocumentPerson() {
    if (this.modelRegister && this.modelRegister.person && this.modelRegister.person.classification) {
      switch (this.modelRegister.person.classification.value) {
        case "PF":
          const cpfClean = Utils.removeMask(this.modelRegister.person.cpf);
          if (cpfClean && cpf.isValid(cpfClean))
            return cpfClean;

        case "PJ":
          const cnpjClean = Utils.removeMask(this.modelRegister.person.cnpj);
          if (cnpjClean && cnpj.isValid(cnpjClean))
            return cnpjClean;

        case "ESTRANGEIRO":
          const rne = Utils.removeMask(this.modelRegister.person.rne);
          if (rne) {
            return rne;
          }
      }
    }
  }

  getPersonTypeList(id: number) {
    return this.personTypeList?.filter(i => i.id == id)[0].value;
  }

  resetPartnerSearchName() {
    this.partnerAvailableList = Array.from(this.partnerList);
    this.partnerSearch.person = new Person();
  }

  filterPartner() {
    this.partnerAvailableList = Array.from(this.partnerList);

    this.partnerAvailableList = Array.from(this.partnerList.filter(partner => {
      return ((this.partnerSearch && this.partnerSearch.person && this.partnerSearch.person.name) ? (partner.person.name ? partner.person.name.toLowerCase().indexOf(this.partnerSearch.person.name.toLowerCase()) > -1 : false) : true)
        && ((this.partnerSearch && this.partnerSearch.partnerGroup && this.partnerSearch.partnerGroup.name) ? (partner && partner.partnerGroup && partner.partnerGroup.name ? partner.partnerGroup.name.toLowerCase().indexOf(this.partnerSearch.partnerGroup.name.toLowerCase()) > -1 : false) : true)
    }));
  }

  resetAgentSearchName() {
    this.agentAvailableList = Array.from(this.agentList);
    this.agentSearch.person = new Person();

    //REMOVE O SELLER QUE ESTA SENDO EDITADO PARA NÃO ADICIONÁ-LO COMO PRÓPRIO AGENTE
    this.agentAvailableList = this.agentAvailableList.filter(item => item.id !== this.modelRegister.id);
  }

  fillAgent() {
    this.agentAvailableList = Array.from(this.agentList);

    this.agentAvailableList = Array.from(this.agentList.filter(agent => {
      return ((this.agentSearch && this.agentSearch.person && this.agentSearch.person.name) ? (agent.person.name ? agent.person.name.toLowerCase().indexOf(this.agentSearch.person.name.toLowerCase()) > -1 : false) : true)
    }));
  }

  onClick(option: any) {
    if(!option.enabled) {
        event.stopPropagation();
    }
  }

}
