import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { ProposalStateDictionary } from 'src/app/shared/dictionary/proposal-state.dictionary';
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { EventTypeEnum } from 'src/app/shared/enum/event-type-enum';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { ProposalPersonTypeEnum } from 'src/app/shared/enum/proposal-person-type-enum';
import { ProposalRiskEnum } from 'src/app/shared/enum/proposal-risk-enum';
import { ProposalStatusEnum } from 'src/app/shared/enum/proposal-status-enum';
import { Brand } from 'src/app/shared/model/brand.model';
import { Channel } from 'src/app/shared/model/channel-model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Item } from 'src/app/shared/model/item.model';
import { Model } from 'src/app/shared/model/model.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { PersonHolding } from 'src/app/shared/model/person-holding.model';
import { Product } from 'src/app/shared/model/product.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProposalDetail } from 'src/app/shared/model/proposal-detail.dto';
import { Seller } from 'src/app/shared/model/seller.model';
import { Vehicle } from 'src/app/shared/model/vehicle.model';
import { ChannelService } from 'src/app/shared/service/channel.service';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ProposalService } from 'src/app/shared/service/proposal.service';
import { Utils } from 'src/app/shared/util/util';
import { ValidateUtil } from 'src/app/shared/util/validate.util';
import { ProposalFormService } from './proposal-form.service';
import { DocumentModel } from 'src/app/shared/model/document.model';

@Component({
  selector: 'app-proposal-form',
  templateUrl: './proposal-form.component.html'
})
export class ProposalFormComponent implements OnInit {

  id: number = 0;
  isEdit: boolean = false;
  tabViewIndex: number = 0;
  error: string;

  tabCustomerInvalid: boolean = false;
  tabPartnerInvalid: boolean = true;

  cols: any[];
  colsQualification: any[];
  proposalStatusEnum: any = ProposalStatusEnum;
  saleOrderStatusList: Classifier[];

  register: ProposalDTO = new ProposalDTO();
  holdings: PersonHolding[] = [];

  channelSelected: Channel = new Channel();
  proposalRiskSelected: Classifier = new Classifier();

  // Veiculo
  vehicleRegister: Vehicle = new Vehicle();
  brandList: Brand[] = new Array<Brand>();
  modelList: Model[] = Array<Model>();
  productList: Product[] = Array<Product>();
  riskList: Classifier[];
  customerTypeList: Classifier[];
  itemList: Item[] = new Array<Item>();
  itemOpitionalList: Item[] = new Array<Item>();
  channelList: Channel[] = [];

  productSelected: Product = new Product();
  itemSelected: Item = new Item();
  itemOpitionalSelected: Item = new Item();

  sentDocuments: DocumentModel[] = [] ;

  @ViewChild('registerForm', { static: false }) registerForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private channelService: ChannelService,
    private proposalService: ProposalService,
    private classifierService: ClassifierService,
    private proposalFormService: ProposalFormService
  ) { }

  ngOnInit() {
    this.resetRegisterForm();
    this.loadProposalRiskList();
    this.loadChannel();
    this.loadStatusProposalList();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = + params.get('id');
      this.id && this.loadProposal();
    });

  }

  loadStatusProposalList() {
    this.classifierService.searchByType('SALES_ORDER_STATUS').pipe(first()).subscribe(data => {
      this.saleOrderStatusList = data;
      this.saleOrderStatusList.sort((a, b) => (a.id < b.id ? -1 : 1));
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }


  loadProposal() {
    this.proposalService.getProposal(this.id).pipe(first()).subscribe(data => {
      if (data.proposal.proposalDetailVehicle.vehicle && data.proposal.proposalDetailVehicle.vehicle.purchaseDate) {
        data.proposal.proposalDetailVehicle.vehicle.purchaseDate = Utils.normalizeDate(data.proposal.proposalDetailVehicle.vehicle.purchaseDate);
      } else if (!data.proposal.proposalDetailVehicle.vehicle) {
        data.proposal.proposalDetailVehicle.vehicle = new Vehicle();
        data.proposal.proposalDetailVehicle.vehicle.model = new Model;
        data.proposal.proposalDetailVehicle.vehicle.model.brand = new Brand;
        data.proposal.proposalDetailVehicle.futureDelivery = true;
      }

      this.register = data;
      this.register.proposal.proposalPayment.map(payment => {
        payment.showPaymentPreApproved = true;
        payment.dueDate = Utils.normalizeDate(payment.dueDate);
        payment.paymentPercent = _.round(payment.paymentAmount / data.proposal.proposalDetailVehicle.totalAmount * 100, 2);
      });

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadChannel() {
    let channel = new Channel();
    channel.active = true;

    this.channelService.find(channel).pipe(first()).subscribe(data => {
      this.channelList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadProposalRiskList() {
    this.classifierService.searchByType(ClassifierEnum.PROPOSAL_RISK).pipe(first()).subscribe(data => {
      this.riskList = data;
      this.riskList.map(risk => {
        risk.label = Utils.titlecase(risk.label);
        return risk;
      });
      if (!this.id) {
        this.register.proposal.riskClassification = this.riskList.find(x => x.value == ProposalRiskEnum.normal);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.register = new ProposalDTO();
    this.register.proposal = new Proposal();
    this.register.proposal.proposalDetail = new ProposalDetail();
    this.registerForm && this.registerForm.reset({
      immediateDelivery: false
    });
  }

  saveUpdateState(state: string, message: string) {
    this.confirmationService.confirm({
      message: `Confirma a alteração de situação da proposta para ${message}?`,
      header: 'Alterar Situação da proposta',
      acceptLabel: 'Submeter',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.save(state);
      }
    });
  }

  saveUpdateSaleOrderStatus(state: string, message: string) {
    this.confirmationService.confirm({
      message: `Confirma a alteração de situação do pedido para ${message}?`,
      header: 'Alterar Situação do pedido',
      acceptLabel: 'Submeter',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.saveOrder(state);
      }
    });
  }

  saveOrder(state?: string) {

    if (!this.validForm()) {
      return false;
    }

    let stateOrderOld = this.register.proposal.salesOrder.status
    let register = _.cloneDeep(this.register);

    register.proposal.proposalNumber = this.register.proposal.proposalNumber;
    register.proposal.salesOrder.statusClassification = this.saleOrderStatusList.find(data => data.value == state);
    register.proposal.risk = register.proposal.riskClassification?.value; // in progress
    register.proposal.immediateDelivery = register.proposal.immediateDelivery || false;

    if (register.proposal.immediateDelivery) {
      register.proposal.personList = [];
    }

    let proposalDetailVehicle = _.cloneDeep(register.proposal.proposalDetailVehicle);
    proposalDetailVehicle.standardTermDays = proposalDetailVehicle.standardTermDays || 0;
    proposalDetailVehicle.agreedTermDays = proposalDetailVehicle.agreedTermDays || 0;
    proposalDetailVehicle.overPrice = proposalDetailVehicle.overPrice || 0;
    proposalDetailVehicle.overPricePartnerDiscountAmount = proposalDetailVehicle.overPricePartnerDiscountAmount || 0;
    proposalDetailVehicle.overPricePartnerDiscountPercent = proposalDetailVehicle.overPricePartnerDiscountPercent || 0;
    proposalDetailVehicle.priceDiscountPercent = proposalDetailVehicle.priceDiscountPercent || 0;
    proposalDetailVehicle.priceDiscountAmount = proposalDetailVehicle.priceDiscountAmount || 0;
    proposalDetailVehicle.productAmountDiscount = proposalDetailVehicle.productAmountDiscount || 0;
    proposalDetailVehicle.productPercentDiscount = proposalDetailVehicle.productPercentDiscount || 0;
    proposalDetailVehicle.totalAmount = proposalDetailVehicle.totalAmount || 0;
    proposalDetailVehicle.totalTaxAmount = proposalDetailVehicle.totalTaxAmount || 0;
    proposalDetailVehicle.totalTaxPercent = proposalDetailVehicle.totalTaxPercent || 0;
    register.proposal.riskClassification = null;
    register.proposal.statusClassification = null;

    if (this.register.proposal.proposalDetailVehicle.futureDelivery == undefined || this.register.proposal.proposalDetailVehicle.futureDelivery == null
      || this.register.proposal.proposalDetailVehicle.futureDelivery == false) {
      this.register.proposal.proposalDetailVehicle.vehicle.model = this.register.proposal.proposalDetailVehicle.model;
      this.register.proposal.proposalDetailVehicle.vehicle.modelYear = this.register.proposal.proposalDetailVehicle.modelYear;
      this.register.proposal.proposalDetailVehicle.vehicle.version = this.register.proposal.proposalDetailVehicle.version;

      const vehicle = _.cloneDeep(register.proposal.proposalDetailVehicle.vehicle);
      vehicle.id = register.proposal.proposalDetailVehicle.vehicle.id;
      vehicle.model = register.proposal.proposalDetailVehicle.model;
      vehicle.modelYear = register.proposal.proposalDetailVehicle.modelYear;
      vehicle.version = register.proposal.proposalDetailVehicle.version;
      vehicle.purchaseDate = new Date(this.register.proposal.proposalDetailVehicle.vehicle.purchaseDate);

      proposalDetailVehicle.vehicle = vehicle;
    }

    register.proposal.proposalDetailVehicle = proposalDetailVehicle;

    let channel = new Channel();
    let seller = new Seller();
    let intern = new Seller();
    let partner = new Partner();

    channel.id = register.proposal.proposalDetail.channel?.id;
    seller.id = register.proposal.proposalDetail.seller?.id;
    intern.id = register.proposal.proposalDetail.channel?.hasInternalSale ? register.proposal.proposalDetail.internSale?.id : null;
    partner.id = register.proposal.proposalDetail.partner?.id;

    register.proposal.proposalDetail.channel = channel;
    register.proposal.proposalDetail.seller = seller;
    register.proposal.proposalDetail.internSale = intern;
    register.proposal.proposalDetail.partner = partner;

    register.proposal.proposalPayment.map(payment => {
      payment.preApproved = payment.preApproved || false;
      payment.antecipatedBilling = payment.antecipatedBilling || false;
    });

    register.proposal.proposalDetailVehicleItem.map(item => {
      item.amountDiscount = item.amountDiscount || 0;
      item.percentDiscount = item.percentDiscount || 0;
      item.finalPrice = item.finalPrice || 0;
      item.forFree = item.forFree || false;
      item.proposalDetailVehicle = null;
    });

    if (register.proposal.proposalCommission) {
      register.proposal.proposalCommission.map(item => {
        item.dueDate = item.dueDate || null;
      })
    }

    var method = register.proposal.id ? 'update' : 'save';
    let message = register.proposal.id ? 'atualizado' : 'adicionado';

    this.proposalFormService[method](register).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });
      this.id = data.proposal.id;
       if (this.register.proposal.documents) {
         this.sendDocuments(register);
       }


      this.loadProposal();
    }, error => {
      this.register.proposal.salesOrder.statusClassification = stateOrderOld;
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  save(state?: string) {
    if (!this.validForm()) {
      return false;
    }

    let stateOld = this.register.proposal.status || ProposalStateDictionary[0].value;
    let register = _.cloneDeep(this.register);

    register.proposal.proposalNumber = this.register.proposal.proposalNumber;
    register.proposal.status = state || stateOld || ProposalStateDictionary[0].value; // in progress
    register.proposal.risk = register.proposal.riskClassification?.value; // in progress
    register.proposal.immediateDelivery = register.proposal.immediateDelivery || false;
    register.proposal.contract = register.proposal.contract || null;

    if (register.proposal.immediateDelivery) {
      register.proposal.personList = [];
    }

    let proposalDetailVehicle = _.cloneDeep(register.proposal.proposalDetailVehicle);
    proposalDetailVehicle.standardTermDays = proposalDetailVehicle.standardTermDays || 0;
    proposalDetailVehicle.agreedTermDays = proposalDetailVehicle.agreedTermDays || 0;
    proposalDetailVehicle.overPrice = proposalDetailVehicle.overPrice || 0;
    proposalDetailVehicle.overPricePartnerDiscountAmount = proposalDetailVehicle.overPricePartnerDiscountAmount || 0;
    proposalDetailVehicle.overPricePartnerDiscountPercent = proposalDetailVehicle.overPricePartnerDiscountPercent || 0;
    proposalDetailVehicle.priceDiscountPercent = proposalDetailVehicle.priceDiscountPercent || 0;
    proposalDetailVehicle.priceDiscountAmount = proposalDetailVehicle.priceDiscountAmount || 0;
    proposalDetailVehicle.productAmountDiscount = proposalDetailVehicle.productAmountDiscount || 0;
    proposalDetailVehicle.productPercentDiscount = proposalDetailVehicle.productPercentDiscount || 0;
    proposalDetailVehicle.totalAmount = proposalDetailVehicle.totalAmount || 0;
    proposalDetailVehicle.totalTaxAmount = proposalDetailVehicle.totalTaxAmount || 0;
    proposalDetailVehicle.totalTaxPercent = proposalDetailVehicle.totalTaxPercent || 0;
    register.proposal.riskClassification = null;
    register.proposal.statusClassification = null;

    if (this.register.proposal.proposalDetailVehicle.futureDelivery == undefined || this.register.proposal.proposalDetailVehicle.futureDelivery == null
      || this.register.proposal.proposalDetailVehicle.futureDelivery == false) {
      this.register.proposal.proposalDetailVehicle.vehicle.model = this.register.proposal.proposalDetailVehicle.model;
      this.register.proposal.proposalDetailVehicle.vehicle.modelYear = this.register.proposal.proposalDetailVehicle.modelYear;
      this.register.proposal.proposalDetailVehicle.vehicle.version = this.register.proposal.proposalDetailVehicle.version;

      const vehicle = _.cloneDeep(register.proposal.proposalDetailVehicle.vehicle);
      vehicle.id = register.proposal.proposalDetailVehicle.vehicle.id;
      vehicle.model = register.proposal.proposalDetailVehicle.model;
      vehicle.modelYear = register.proposal.proposalDetailVehicle.modelYear;
      vehicle.version = register.proposal.proposalDetailVehicle.version;
      vehicle.purchaseDate = new Date(this.register.proposal.proposalDetailVehicle.vehicle.purchaseDate);
      proposalDetailVehicle.vehicle = vehicle;
    }

    register.proposal.proposalDetailVehicle = proposalDetailVehicle;

    let channel = new Channel();
    let seller = new Seller();
    let intern = new Seller();
    let partner = new Partner();

    channel.id = register.proposal.proposalDetail.channel?.id;
    seller.id = register.proposal.proposalDetail.seller?.id;
    intern.id = register.proposal.proposalDetail.channel?.hasInternalSale ? register.proposal.proposalDetail.internSale?.id : null;
    partner.id = register.proposal.proposalDetail.partner?.id;

    register.proposal.proposalDetail.channel = channel;
    register.proposal.proposalDetail.seller = seller;
    register.proposal.proposalDetail.internSale = intern;
    register.proposal.proposalDetail.partner = partner;

    register.proposal.proposalPayment.map(payment => {
      payment.preApproved = payment.preApproved || false;
      payment.antecipatedBilling = payment.antecipatedBilling || false;

    });

    register.proposal.proposalDetailVehicleItem.map(item => {
      item.amountDiscount = item.amountDiscount || 0;
      item.percentDiscount = item.percentDiscount || 0;
      item.finalPrice = item.finalPrice || 0;
      item.forFree = item.forFree || false;
      item.proposalDetailVehicle = null;
    });

    if (register.proposal.proposalCommission) {
      register.proposal.proposalCommission.map(item => {
        item.dueDate = item.dueDate || null;
      })
    }

    const self = this;
    if (register.proposal.id) {
      this.sendDocuments(register, () => {
        self.sendProposal(register, stateOld, () => self.loadProposal());
      })

    } else {
      this.sendProposal(register, stateOld, () => {
        self.sendDocuments(register, () => self.loadProposal());
      });
    }
  }

  private sendProposal(register: ProposalDTO, stateOld: string, callback: Function = () => {}) {
    var method = register.proposal.id ? 'update' : 'save';
    let message = register.proposal.id ? 'atualizado' : 'adicionado';

    this.proposalFormService[method](register).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });
      this.id = data.proposal.id;
        callback();
    }, error => {
      this.register.proposal.status = stateOld;
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  private sendDocuments(register: ProposalDTO, callback: Function = () => {}) {
    if (register.proposal.documents
      && this.register.proposal.documents.length > 0) {
      const files = [];
      const fIds: number[] = []

      for (let document of this.register.proposal.documents) {
        const file = document.file;
        if (file) {
          files.push(document.file);
          fIds.push(document.type.id);
        }

      }

      if (files.length > 0){
        this.proposalFormService.uploadToProposal(files, fIds, this.id).pipe(first()).subscribe(documents => {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Documento(s) anexado(s) com sucesso!` });
          register.proposal.documents = documents;
          callback();
        }, error => {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível realizar o upload do documento.'
          });
        });
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  // valid form
  validForm() {
    this.error = '';
    this.error = this.getErrorHeader()
      || this.getErrorClient()
      || this.getErrorDocumentContact()
      || this.getErrorFinantialContact()
      || this.getErrorPartner()
      || this.getErrorVehicle()
      || this.getErrorDays()
      || this.getErrorPayment();

    if (this.error) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Informações inválidas', detail: this.error });
      return false;
    }
    return true;
  }

  getErrorHeader() {
    if (!this.register.proposal.proposalDetail.channel) {
      return 'Informe o Canal';
    }
    if (!this.register.proposal.riskClassification) {
      return 'Informe o Risco';
    }
  }

  getErrorClient() {
    if (this.register.proposal.immediateDelivery) {
      return;
    }
    if (!this.register.proposal.personList || !this.register.proposal.personList.length) {
      return 'Informe o cliente';
    } else {
      let existsFinancier = false;
      this.register.proposal.personList.map((item, index) => {
        if (!this.register.proposal.immediateDelivery
          && item.person.classification.value == PersonClassifierEnum.physical
          && (!item.person.cpf || !ValidateUtil.isCPF(item.person.cpf))) {
          this.error = 'Informe um CPF de cliente válido!';
        } else if (!this.register.proposal.immediateDelivery
          && item.person.classification.value == PersonClassifierEnum.legal
          && (!item.person.cnpj || !ValidateUtil.isCNPJ(item.person.cnpj))) {
          this.error = 'Informe um CNPJ de cliente válido!';
        } else if (item.person.classification.value == PersonClassifierEnum.foreign && !item.person.rne) {
          this.error = 'Informe um RNE de cliente válido!';
        } else if (item.person.negativeList) {
          this.error = "Não é possível confeccionar uma proposta para essa pessoa. Em caso de dúvidas, consulte o time Administrativo.";
        } else if (item.person.classification.value != 'PJ' && (!item.email || !ValidateUtil.isEmail(item.email.toLowerCase()))) {
          this.error = 'Informe um e-mail de cliente válido';
        } else if (item.person.classification.value != 'PJ' && (!item.phone || item.phone.length < 10)) {
          this.error = 'Informe um telefone de cliente válido';
        } else if (!item.person.name) {
          this.error = 'Informe um nome de cliente';
        } else if (!item.proposalPersonClassification) {
          this.error = 'Informe o papel do cliente';
        } else if (existsFinancier && item.proposalPersonClassification.value == ProposalPersonTypeEnum.financier) {
          this.error = 'Somente um cliente com papel FINANCIADOR é permitido!';
        } else if (index == 0 && item.person.classification.value == PersonClassifierEnum.legal) {
          if (!this.register.proposal.commercialContactName) {
            this.error = 'Informe o nome do contato comercial!';
          } else if (!this.register.proposal.commercialContactEmail) {
            this.error = 'Informe o e-mail de contato comercial!';
          } else if (!this.register.proposal.commercialContactPhone) {
            this.error = 'Informe o telefone do contato comercial!';
          }
        }
      });

      if (!this.register.proposal.immediateDelivery
        && this.register?.proposal?.personList?.findIndex(p => p.proposalPersonClassification ? p.proposalPersonClassification.value == ProposalPersonTypeEnum.financier : null) < 0) {
        this.error = 'É obrigatória a seleção de um cliente com papel FINANCIADOR!';
      }

      return this.error;
    }
  }

  getErrorDocumentContact() {
    if (this.isShowContact() && !this.register.proposal.documentContact
      && (!this.register.proposal.documentContactEmail
        || !this.register.proposal.documentContactName
        || !this.register.proposal.documentContactPhone)) {
      return 'Verifique os dados de contato da Documentação';
    }
  }

  getErrorFinantialContact() {
    if (this.isShowContact() && !this.register.proposal.finantialContact
      && (!this.register.proposal.finantialContactEmail
        || !this.register.proposal.finantialContactName
        || !this.register.proposal.finantialContactPhone)) {
      return 'Verifique os dados de contato do Financeiro';
    }
  }

  getErrorPartner() {
    if (this.register.proposal.proposalDetail.channel.hasPartner) {
      if (!this.register.proposal.proposalDetail.partner
        || !this.register.proposal.proposalDetail.partner.id) {
        return 'Informe o Parceiro';
      }
      if (!this.register.proposal.proposalDetail.seller
        || !this.register.proposal.proposalDetail.seller.id) {
        return 'Informe o Executivo de Conta';
      }
    }
  }

  getErrorDays() {
    if (!this.register.proposal.proposalDetailVehicle.standardTermDays) {
      return 'Informe o Prazo Padrão';
    }
    if (!this.register.proposal.proposalDetailVehicle.agreedTermDays) {
      return 'Informe o Prazo Acordado';
    }

    if (this.register.proposal.proposalDetailVehicle.standardTermDays > this.register.proposal.proposalDetailVehicle.agreedTermDays) {
      return 'Prazo Acordado não pode ser inferior ao Prazo Padrão';
    }
  }

  getErrorVehicle() {
    if (!this.register.proposal.proposalDetailVehicle.model.brand.id) {
      return 'Informe Marca';
    }

    if (!this.register.proposal.proposalDetailVehicle.model.id) {
      return 'Informe Modelo';
    }

    if (!this.register.proposal.proposalDetailVehicle.modelYear
      || this.register.proposal.proposalDetailVehicle.modelYear.toString().length != 4) {
      return 'Informe Ano Modelo';
    }

    if (!this.register.proposal.proposalDetailVehicle.priceProduct.productModel.product.id) {
      return 'Informe o Produto';
    }

    if (!this.register.proposal.proposalDetailVehicle.futureDelivery
      && !this.register.proposal.proposalDetailVehicle.vehicle.chassi) {
      return 'Informe o Chassi';
    }
  }

  getErrorPayment() {
    if (this.register.proposal?.proposalPayment?.length > 0) {

      let totalAmount = 0;
      let totalPercent = 0;

      let list = [EventTypeEnum.FIXED_DATE, EventTypeEnum.CHECK_IN, EventTypeEnum.CHECK_OUT];
      this.register.proposal.proposalPayment.map(payment => {
        if (payment.canNotGenerateAcconuts) {
          if (!payment.payer || !payment.event
            || !payment.paymentAmount || !payment.paymentPercent) {
            this.error = 'Verifique os dados financeiros';
          }
        } else if (!payment.payer || !payment.event
          || !payment.paymentAmount || !payment.paymentPercent || !payment.paymentMethod
          || !payment.paymentRule || !payment.installmentAmount) {
          this.error = 'Verifique os dados financeiros';
        }
        totalAmount += payment.paymentAmount || 0;
        totalPercent += payment.paymentPercent || 0;

        if (!list.find(e => e == payment.event?.value)) {
          payment.dueDate = null;
        }
      });

      this.register.proposal.proposalPayment.forEach(p => {
        if (!p.dueDate && p.event.value == EventTypeEnum.FIXED_DATE) {
          this.error = 'Verifique os dados financeiros, campo Data Pactuada obrigatório!';
          return
        }
      });

      if (!this.error) {
        if (_.round(totalAmount, 0) != _.round(this.register.proposal.proposalDetailVehicle.totalAmount, 0)) {
          return 'O valor total dos pagamentos deve ser igual ao total da proposta';
        }
      }
    } else {
      return 'Ao menos uma condição de pagamento deve ser informada';
    }

    return this.error;
  }

  isShowContact() {
    let list = [
      ProposalStatusEnum.onCustomerApproval.toString(),
      ProposalStatusEnum.finishedWithoutSale.toString(),
      ProposalStatusEnum.finishedWithSale.toString(),
      ProposalStatusEnum.canceled.toString()
    ];
    return list.indexOf(this.register.proposal.status) >= 0;
  }
}

