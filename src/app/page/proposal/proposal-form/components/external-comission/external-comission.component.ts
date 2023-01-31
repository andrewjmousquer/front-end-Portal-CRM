import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import * as _ from "lodash";

import { PartnerFormService } from 'src/app/page/partner-form/partner-form.service';
import { PersonFormService } from 'src/app/page/person-form/person-form.service';

import { BankAccount } from 'src/app/shared/model/bank-account.model';
import { PartnerPerson } from 'src/app/shared/model/partner-person.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { Person } from 'src/app/shared/model/person.model';
import { Proposal } from 'src/app/shared/model/proposal';

import { PersonClassifierEnum } from "src/app/shared/enum/person-classifier-enum";
import { MaskEnum } from 'src/app/shared/enum/mask-enum';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { PersonDocumentEnum } from 'src/app/shared/enum/person-document-enum';
import { CommissionTypeEnum } from 'src/app/shared/enum/commission-type-enum';
import { ProposalCommission } from 'src/app/shared/model/proposal-commission';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { NgForm } from '@angular/forms';
import { CheckpointService } from 'src/app/shared/service/checkpoint.service';
import { Checkpoint } from 'src/app/shared/model/checkpoint.model';
import { Contact } from 'src/app/shared/model/contact.model';
import { ContactEnum } from 'src/app/shared/enum/contact-enum';
import { ProposalPerson } from 'src/app/shared/model/proposal-person';

@Component({
  selector: 'wbp-external-comission',
  templateUrl: './external-comission.component.html'
})
export class ExternalComissionComponent implements OnInit {

  @Input() proposal: Proposal;
  @Input() editable: boolean;

  @Output() updateRegister: EventEmitter<Proposal> = new EventEmitter();

  displayModal: boolean;

  cols: any[];

  listCommission: ProposalCommission[];

  isEdit = false;
  disableEdit = true;
  register: ProposalCommission;
  partner: Partner;

  proposalCommissionValue: number = 0; //TODO ALTERAR PARA VALOR DE COMISSAO DA PROPOSTA (CALCULAR)
  proposalTotalCommissionValue: number = 0;
  proposalRemainingCommisionBalance: number = 0;

  proposalTotalBonusValue: number = 0;

  proposalTotalPayPrizeValue: number = 0;

  proposalTotalValue: number = 0;

  employeeList: PartnerPerson[];
  selectedEmployee: PartnerPerson;

  contactsList: Contact[];

  bankAccountList: BankAccount[];
  selectedBankAccount: BankAccount;

  commissionTypeList: Classifier[];

  checkpointList: Checkpoint[];

  defaultEmployee: PartnerPerson;

  selectedBankAccountList: BankAccount[];

  personClassifierEnum: any = PersonClassifierEnum;
  personDocumentEnum: any = PersonDocumentEnum;
  maskEnum: any = MaskEnum;

  defaultCommission: number = 0;
  defaultCommissionChecked: boolean = false;
  defaultBonus: number = 0;
  defaultBonusChecked: boolean = false;
  defaultPayPrize: number = 0;
  defaultPayPrizeChecked: boolean = false;

  disableDefaultCommission = true;
  disableDefaultCommissionCheck = true;
  disableDefaultPayPrize = true;
  disableDefaultPayPrizeCheck = true;
  disableDefaultBonus = true;
  disableDefaultBonusCheck = true;
  hasPermissionToSetDueDate = false;

  @ViewChild("defaultPayPrize") defaultPayPrizeElement: ElementRef;

  nameList: any[] = [];

  selectedName: any;

  @ViewChild('formRegister', { static: false }) formRegister: NgForm;

  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private classifierService: ClassifierService,
    private partnerService: PartnerFormService,
    private personService: PersonFormService,
    private checkpointService: CheckpointService) { }

  ngOnInit(): void {
    this.resetRegisterForm();
    this.loadCommissionTypeList();
    this.loadCheckpointList();

    this.cols = [
      { field: 'partnerPerson.personType.label', header: 'Tipo de Comissionado' },
      { field: 'partnerPerson.person.name', header: 'Dados do Comissionado' },
      { field: 'value', header: 'Valor' },
      { field: 'dueDate', header: 'Vencimento' },
      { field: 'commissionType.value', header: 'Tipo Comissão' },
      { field: 'dueDate', header: 'Dados Pagamento' },
      { field: 'notes', header: 'Obs' },
    ];
  }

  ngDoCheck(): void {
    this.buildVars();
    this.updateRegister.emit(this.proposal);

  }

  buildVars() {
    if (this.proposal && this.proposal.id && this.proposal.id > 0) {
      if (this.proposal.proposalDetailVehicle) {
        this.proposalCommissionValue = this.proposal.proposalDetailVehicle.overPrice - this.proposal.proposalDetailVehicle.overPricePartnerDiscountAmount;
      }

      if (this.proposal.proposalDetail.partner && this.proposal.proposalDetail.partner.id) {
        this.partner = this.proposal.proposalDetail.partner;
      }

      if (this.proposal.proposalDetailVehicle && this.proposal.proposalDetailVehicle.overPrice) {
        this.proposalCommissionValue = this.proposal.proposalDetailVehicle.overPrice - this.proposal.proposalDetailVehicle.overPricePartnerDiscountAmount;
      }

      this.fillCommisionValues();

    }
  }

  resetRegisterForm() {
    this.isEdit = false;

    this.register = new ProposalCommission();
    this.register.bankAccount = new BankAccount();
    this.register.partnerPerson = new PartnerPerson();
    this.register.partnerPerson.person = new Person();
    this.register.partnerPerson.person.classification = new Classifier();
    this.register.partnerPerson.person.classification.value = 'PF';

    this.selectedBankAccount = new BankAccount();
    this.bankAccountList = [];

    this.selectedEmployee = new PartnerPerson();
    this.selectedEmployee.person = new Person();
    this.selectedEmployee.person.classification = new Classifier();
    this.selectedEmployee.person.classification.value = 'PF';
    this.selectedEmployee.personType = new Classifier();
    this.selectedEmployee.personType.value = 'PF';

    this.defaultEmployee = new PartnerPerson();
    this.defaultEmployee.person = new Person();
    this.defaultEmployee.person.id = 0;
    this.defaultEmployee.person.name = "SELECIONE";
    this.defaultEmployee.person.classification = new Classifier();
    this.defaultEmployee.person.classification.value = 'PF';

    this.defaultCommission = 0;
    this.defaultBonus = 0;
    this.defaultPayPrize = 0;

    this.defaultBonusChecked = false;
    this.defaultCommissionChecked = false;
    this.defaultPayPrizeChecked = false;

    this.setDisableFields(true);

    if (!this.listCommission) {
      this.listCommission = [];
    }
  }

  setDisableFields(value: boolean) {
    this.disableEdit = value;
    this.disableDefaultPayPrize = value;
    this.disableDefaultPayPrizeCheck = value;
    this.disableDefaultCommission = value;
    this.disableDefaultCommissionCheck = value;
    this.disableDefaultBonus = value;
    this.disableDefaultBonusCheck = value;
  }

  loadCommissionTypeList() {
    this.classifierService.searchByType(ClassifierEnum.COMMISSION_TYPE).pipe(first()).subscribe(data => {
      this.commissionTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadCheckpointList() {
    this.checkpointService.getByCurrentUser().pipe(first()).subscribe(data => {
      this.checkpointList = data ? data : [];
      this.hasPermissionToSetDueDate = this.checkpointList.filter(checkpoint => checkpoint.name === 'PROPOSAL.EDIT.EXTERNAL.COMISSION.DATE').length > 0;
    });
  }

  addComission() {
    this.resetRegisterForm();
    this.getPartnerEmployess();
    this.displayModal = true;
  }

  closeModal() {
    this.resetRegisterForm();
  }

  edit(commission: ProposalCommission) {
    this.isEdit = true;
    this.setDisableFields(true);
    this.displayModal = true;
    this.register = commission;

    this.selectedEmployee = this.register.partnerPerson;
    this.loadPersonDetail();

    if (commission.commissionType.value === CommissionTypeEnum.commission) {
      this.defaultCommission = commission.value;
      this.disableDefaultCommission = false;
      this.defaultCommissionChecked = true;
    } else if (commission.commissionType.value === CommissionTypeEnum.bonus) {
      this.defaultBonus = commission.value;
      this.disableDefaultBonus = false;
      this.defaultBonusChecked = true;
    } else if (commission.commissionType.value === CommissionTypeEnum.pay_prize) {
      this.defaultPayPrize = commission.value;
      this.disableDefaultPayPrize = false;
      this.defaultPayPrizeChecked = true;
    }
  }

  remove(commission: ProposalCommission) {
    this.confirmationService.confirm({
      message: `Deseja remover ${commission.partnerPerson.person.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        let index = this.listCommission.indexOf(commission);
        this.listCommission.splice(index, 1);
        this.listCommission = [...this.listCommission]
      }
    });
  }


  getPartnerEmployess() {
    if (this.partner && this.partner.id) {
      this.partnerService.getById(this.partner.id).pipe(first()).subscribe(data => {
        if (data) {
          this.partner = data;

          if (this.partner.employeeList && this.partner.employeeList.length > 0) {
            this.employeeList = this.partner.employeeList;

            if(this.employeeList.length == 1){
              this.selectedEmployee = this.employeeList[0];
              this.loadPersonDetail();
            } else {
              this.employeeList.sort((empA, empB) => (empA.person.name < empB.person.name) ? -1 : 1);
            }
          } else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O parceiro ${this.partner.person.name} não possui colaboradores!` });
            this.employeeList = [];
          }
        }
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  loadPersonDetail() {
    if (this.selectedEmployee && this.selectedEmployee.person && this.selectedEmployee.person.id > 0) {
      this.personService.getById(this.selectedEmployee.person.id).pipe(first()).subscribe(data => {
        if (data) {
          this.selectedEmployee.person = data;

          if (this.selectedEmployee.person.bankAccount && this.selectedEmployee.person.bankAccount.length > 0) {
            this.bankAccountList = this.selectedEmployee.person.bankAccount;
            this.bankAccountList.forEach(bank => {
              bank.label = bank.bank.name + ' - AG: ' + bank.agency + ' C: ' + bank.accountNumber;
            });

            if (this.isEdit) {
              this.selectedBankAccount = this.register.bankAccount;
            }

          } else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O colaborador ${this.selectedEmployee.person.name} não possui dados bancários!` });
            this.bankAccountList = [];
          }
          let phone: boolean = false;
          let email: boolean = false;
          if (this.selectedEmployee.person.contacts && this.selectedEmployee.person.contacts.length > 0) {
            this.contactsList = this.selectedEmployee.person.contacts;
            this.contactsList.forEach(contact => {
              if (contact.type && contact.type.value === ContactEnum.TELEFONE) {
                phone = true;
              }
              if (contact.type.value === ContactEnum.CELULAR) {
                phone = true;
              }
              if (contact.type.value === ContactEnum.EMAIL) {
                email = true;
              }
            });

            if (!phone) {
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O colaborador ${this.selectedEmployee.person.name} deve possuir pelo menos o telefone no cadastro!` });
              this.contactsList = [];
            }
            if (!email) {
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O colaborador ${this.selectedEmployee.person.name} deve possuir pelo menos o email no cadastro!` });
              this.contactsList = [];
            }

          } else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O colaborador ${this.selectedEmployee.person.name} deve possuir pelo menos telefone e email no cadastro!` });
            this.contactsList = [];
          }


          this.loadCommissionDefaultValues();
        }
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Verifique os dados cadastrais do colaborador ${this.selectedEmployee.person.name}!` });
    }
  }

  loadCommissionDefaultValues() {
    this.defaultCommission = 0;
    this.defaultBonus = 0;
    this.defaultPayPrize = 0;

    if (!this.isEdit && this.selectedEmployee && this.selectedEmployee.commissionList) {
      this.setDisableFields(false);

      this.selectedEmployee.commissionList.forEach(commission => {

        if (commission.commissionType.value === CommissionTypeEnum.commission) {
          this.defaultCommission = commission.defaultValue;
        } else if (commission.commissionType.value === CommissionTypeEnum.bonus) {
          this.defaultBonus = commission.defaultValue;
        } else if (commission.commissionType.value === CommissionTypeEnum.pay_prize) {
          this.defaultPayPrize = commission.defaultValue;
        }

        this.setDisableFields(false);
      });
    }
  }

  closeRegisterModal() {
    this.displayModal = false;
  }

  save() {
    if (this.validSave()) {
      this.fillSave();
    }
  }

  validSave(): boolean {
    let valid: boolean = true;

    if (!this.selectedEmployee.person || !this.selectedEmployee.person.id || this.selectedEmployee.person.id <= 0) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Selecione um comissionado!` });
      valid = false;
    }

    if (!this.selectedBankAccount || !this.selectedBankAccount.id || this.selectedBankAccount.id <= 0) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Selecione os dados bancários!` });
      valid = false;
    }

    if ((!this.defaultCommissionChecked && !this.defaultBonusChecked && !this.defaultPayPrizeChecked) ||
      (!this.defaultCommission || this.defaultCommission == 0) &&
      (!this.defaultBonus || this.defaultBonus == 0) &&
      (!this.defaultPayPrize || this.defaultPayPrize == 0)) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Marque ao menos uma opção de comissão e preencha o valor!` });
      valid = false;
    }

    this.listCommission.forEach(commission => {
      if (commission.partnerPerson.person.id == this.selectedEmployee.person.id) {
        if (commission.commissionType.value == CommissionTypeEnum.commission && this.defaultCommissionChecked &&
          (this.defaultCommission && this.defaultCommission > 0) && !this.isEdit) {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Já existe um valor de comissão cadastrado para esse comissionado!` });
          valid = false;
        }

        if (commission.commissionType.value == CommissionTypeEnum.bonus && this.defaultBonusChecked &&
          (this.defaultBonus && this.defaultBonus > 0) && !this.isEdit) {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Já existe um valor de bônus cadastrado para esse comissionado!` });
          valid = false;
        }

        if (commission.commissionType.value == CommissionTypeEnum.pay_prize && this.defaultPayPrizeChecked &&
          (this.defaultPayPrize && this.defaultPayPrize > 0) && !this.isEdit) {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `Já existe um valor de prêmio cadastrado para esse comissionado!` });
          valid = false;
        }
      }
      if (this.disableDefaultCommission && (commission.value < this.defaultCommission)) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O valor informado deve ser menor que o valor já existente de comissão!` });
        valid = false;
      }
    });



    return valid;
  }

  fillSave() {
    let valid: boolean = true;

    this.register.partnerPerson = this.selectedEmployee;
    this.register.bankAccount = this.selectedBankAccount;
    this.register.proposalDetail = this.proposal.proposalDetail;

    if (this.defaultCommissionChecked && this.defaultCommission) {
      let register = _.clone(this.register);
      register.value = this.defaultCommission;
      register.commissionType = this.commissionTypeList.find(x => x.value == CommissionTypeEnum.commission);

      const totalAmountCommision = (this.proposalTotalCommissionValue - (this.isEdit ? this.register.value : 0)) + register.value;
      if ((totalAmountCommision) > this.proposalCommissionValue) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: `O valor informado para comissão ultrapassa o valor total de comissão da proposta!` });
        valid = false;
      } else {
        this.saveCommission(register);
      }
    }

    if (this.defaultBonusChecked && this.defaultBonus) {
      let register = _.clone(this.register);
      register.value = this.defaultBonus;
      register.commissionType = this.commissionTypeList.find(x => x.value == CommissionTypeEnum.bonus);
      this.saveCommission(register);
    }

    if (this.defaultPayPrizeChecked && this.defaultPayPrize) {
      let register = _.clone(this.register);
      register.value = this.defaultPayPrize;
      register.commissionType = this.commissionTypeList.find(x => x.value == CommissionTypeEnum.pay_prize);
      this.saveCommission(register);
    }

    if (valid) {
      this.closeRegisterModal();
      this.resetRegisterForm();
      this.fillCommisionValues();
    }

    this.proposal.proposalCommission = this.listCommission;
    this.proposal = _.cloneDeep(this.proposal);
  }

  saveCommission(register: ProposalCommission) {
    if (!this.isEdit) {
      this.listCommission.push(register);

    } else {
      this.listCommission.forEach(commission => {
        if (commission.partnerPerson.person.id == register.partnerPerson.person.id && commission.commissionType.value == register.commissionType.value) {
          commission.value = register.value;
        }
      });
    }
  }

  fillCommisionValues() {
    this.proposalTotalCommissionValue = 0;
    this.proposalTotalBonusValue = 0;
    this.proposalTotalPayPrizeValue = 0;
    this.proposalTotalValue = 0;
    this.proposalRemainingCommisionBalance = this.proposalCommissionValue;

    if (this.proposal.proposalCommission && this.proposal.proposalCommission.length > 0) {
      this.listCommission = this.proposal.proposalCommission;
      this.listCommission.forEach(commission => {
        if (commission.commissionType.value == CommissionTypeEnum.commission) {
          this.proposalTotalCommissionValue = this.proposalTotalCommissionValue + commission.value;
        }

        if (commission.commissionType.value == CommissionTypeEnum.bonus) {
          this.proposalTotalBonusValue = this.proposalTotalBonusValue + commission.value;
        }

        if (commission.commissionType.value == CommissionTypeEnum.pay_prize) {
          this.proposalTotalPayPrizeValue = this.proposalTotalPayPrizeValue + commission.value;
        }

        commission.bankAccount.label = commission.bankAccount.bank.name + ' - AG: ' + commission.bankAccount.agency + ' C: ' + commission.bankAccount.accountNumber;
      });

      this.proposalTotalValue = this.proposalTotalCommissionValue + this.proposalTotalBonusValue + this.proposalTotalPayPrizeValue;
      this.proposalRemainingCommisionBalance = this.proposalCommissionValue - this.proposalTotalCommissionValue;
    }
  }

 
}
