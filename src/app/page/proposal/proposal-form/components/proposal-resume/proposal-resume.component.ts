import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';

import { PersonClassificationDictionary } from 'src/app/shared/dictionary/person-classification.dictionary';

import { CnpjPipe } from 'src/app/shared/pipe/cnpj.pipe';
import { CpfPipe } from 'src/app/shared/pipe/cpf.pipe';

import { ContactEnum } from 'src/app/shared/enum/contact-enum';
import { MaskEnum } from 'src/app/shared/enum/mask-enum';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { PersonDocumentEnum } from 'src/app/shared/enum/person-document-enum';
import { ProposalPersonTypeEnum } from 'src/app/shared/enum/proposal-person-type-enum';

import { Classifier } from 'src/app/shared/model/classifier.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProposalApproval } from 'src/app/shared/model/proposal-approval';
import { ProposalDetailVehicleItem } from 'src/app/shared/model/proposal-detail-vehicle-item.dto';
import { ProposalPayment } from 'src/app/shared/model/proposal-payment.model';

import { ProposalApprovalService } from 'src/app/shared/service/proposal-approval.service';
import { ProposalProductItemDTO } from 'src/app/shared/dto/proposal/proposal-product-item.dto';
import { ProposalTotalDTO } from 'src/app/shared/dto/proposal/proposal-total.dto';
import { ProposalResumeItemDTO } from 'src/app/shared/dto/proposal/proposal-resume-item.dto';
import { PhonePipe } from 'src/app/shared/pipe/phone.pipe';

@Component({
  selector: 'wbp-proposal-resume',
  templateUrl: './proposal-resume.component.html',
  styleUrls: ['./proposal-resume.component.css']
})
export class ProposalResumeComponent implements OnInit {

  @Input() proposal: Proposal;

  proposalApproval: ProposalApproval = new ProposalApproval();

  colProducts: any[];
  colFinancial: any[];

  resumeItems: ProposalResumeItemDTO[] = [];
  productItemProposalList: ProposalProductItemDTO[] = [];
  listCommission: ProposalDetailVehicleItem[];
  listFinancial: ProposalPayment[];
  proposalTotal: ProposalTotalDTO;

  maskEnum: any = MaskEnum;
  personClassifierEnum: any = PersonClassifierEnum;
  personClassificationList: Classifier[] = PersonClassificationDictionary;

  constructor(private proposalApprovalService: ProposalApprovalService,
    private messageService: MessageService,
    private phonePipe: PhonePipe,
    private cpfPipe: CpfPipe,
    private cnpjPipe: CnpjPipe) { }

  ngOnInit() {

    this.colProducts = [
      { field: 'itemPrice.item.itemType.name', header: 'Tipo de Item' },
      { field: 'itemPrice.item.cod', header: 'Configuração' },
      { field: 'itemPrice.item.name', header: 'Item' },
      { field: 'itemPrice.item.itemType', header: 'Preço Tabela' },
      { field: 'name', header: 'Desconto' },
      { field: 'name', header: 'Cortesia' },
      { field: 'name', header: 'Preço' }
    ];

    this.colFinancial = [
      { field: 'name', header: 'Pagador' },
      { field: 'name', header: 'Evento' },
      { field: 'name', header: 'Data Pactuada' },
      { field: 'name', header: 'Valor' },
      { field: 'name', header: 'Porcent.' },
      { field: 'name', header: 'Meio de Pagamento' },
      { field: 'name', header: 'Parcelas' },
      { field: 'name', header: 'Valor da Parcela' },
      { field: 'name', header: 'Juros' }
    ];

    this.proposal = this.proposal || new Proposal();
    this.proposalTotal = this.proposalTotal || new ProposalTotalDTO();
    this.resumeItems = [];
  
    this.buildListGridProposal()
  }

  ngOnChanges() {
    this.buildListGridProposal()
  }

  buildListGridProposal() {
    if(this.proposal && this.proposal.proposalDetailVehicle && this.proposal.proposalDetailVehicle.priceProduct &&
        this.proposal.proposalDetailVehicle.priceProduct.productModel && this.proposal.proposalDetailVehicle.priceProduct.productModel.product &&
        this.proposal.proposalDetailVehicle.priceProduct.productModel.product.name){
      let productItem = new ProposalResumeItemDTO();
      productItem.itemTipe = this.proposal.proposalDetailVehicle.priceProduct.productModel.product.name;
      productItem.configuration = '';
      productItem.item = '';
      productItem.priceListValue = this.proposal.proposalDetailVehicle.priceProduct.price;
      productItem.discount = this.proposal.proposalDetailVehicle.priceDiscountAmount;
      productItem.finalPrice = this.proposal.proposalDetailVehicle.productFinalPrice;

      if(!this.resumeItems.some( data => { data.itemTipe == productItem.itemTipe })){
        this.resumeItems.push(productItem);
      }
    }

    if(this.proposal && this.proposal.proposalDetailVehicleItem && this.proposal.proposalDetailVehicleItem.length > 0){
      this.proposal.proposalDetailVehicleItem.map(item => {
        let resumeItem = new ProposalResumeItemDTO();
        resumeItem.itemTipe = item.itemPrice ? item.itemPrice.item.itemType.name : item.itemPriceModel.item.itemType.name;
        resumeItem.configuration = item.itemPrice ? item.itemPrice.item.cod  : item.itemPriceModel.item.cod;
        resumeItem.item = item.itemPrice ? item.itemPrice.item.itemType.name : item.itemPriceModel.item.itemType.name;
        resumeItem.priceListValue = item.itemPrice ? item.itemPrice.price : item.itemPriceModel.price;
        resumeItem.discount = item.amountDiscount;
        resumeItem.forFree = item.forFree ? 'Sim' : 'Não';
        resumeItem.finalPrice = item.finalPrice;

        if(!this.resumeItems.some( data => { data.itemTipe == resumeItem.itemTipe && data.configuration == resumeItem.configuration})){
          this.resumeItems.push(resumeItem);
        }
      });
    }
    
    this.resumeItems = this.resumeItems.filter((v,i,a)=>a.findIndex(v2=>(v2.itemTipe===v.itemTipe && v2.configuration===v.configuration))===i);
  }

  save() {
    this.proposalApprovalService.save(this.proposalApproval).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.proposal = this.proposal || new Proposal();

    this.listCommission = this.proposal.proposalDetailVehicleItem || [];
    this.listFinancial = this.proposal.proposalPayment || [];
  }

  getEmail(): string {
    let email = '';
    if (this.proposal && this.proposal.personList && this.proposal.personList.length > 0) {
      let proposalPerson = this.proposal.personList.find(p =>
        p.proposalPersonClassification && p.proposalPersonClassification.value == ProposalPersonTypeEnum.financier);
      if (proposalPerson && proposalPerson.person && proposalPerson.person.contacts && proposalPerson.person.contacts.length > 0) {
        proposalPerson.person.contacts.forEach(c => {
          if (c.type && c.type.value == (ContactEnum.EMAIL)) {
            email = c.value
          }
        });
      }
    }
    return email;
  }

  getContract(): boolean {
    let show: boolean;
    if (this.proposal?.proposalPayment?.length > 0) {
      this.proposal.proposalPayment.map(payment => {
        if (payment.payer.value == 'PARTNER' && this.proposal.contract) {
          return show = true;
        }
        else return show = false;
      });
      return show;
    }
  }

  getPhone(): string {
    let phone = '';
    if (this.proposal && this.proposal.personList && this.proposal.personList.length > 0) {
      let proposalPerson = this.proposal.personList.find(p =>
        p.proposalPersonClassification && p.proposalPersonClassification.value == ProposalPersonTypeEnum.financier);
      if (proposalPerson && proposalPerson.person && proposalPerson.person.contacts && proposalPerson.person.contacts.length > 0) {
        proposalPerson.person.contacts.forEach(c => {
          if (c.type && (c.type.value === ContactEnum.TELEFONE || c.type.value === ContactEnum.CELULAR)) {
            phone = this.phonePipe.transform(c.value);
          }
        });
      }
      return phone;
    }
  }

  getDocumentName() {
    let proposalPerson = this.proposal.personList.find(p =>
      p.proposalPersonClassification && p.proposalPersonClassification.value == ProposalPersonTypeEnum.financier);
    if (proposalPerson && proposalPerson.person) {
      if (proposalPerson.person.classification.value == PersonClassifierEnum.physical) {
        return PersonDocumentEnum.PF;
      } else if (proposalPerson.person.classification.value == PersonClassifierEnum.legal) {
        return PersonDocumentEnum.PJ;
      } else {
        return PersonDocumentEnum.ESTRANGEIRO;
      }
    }
  }

  getDocumentValue() {
    let proposalPerson = this.proposal.personList.find(p =>
      p.proposalPersonClassification && p.proposalPersonClassification.value == ProposalPersonTypeEnum.financier);
    if (proposalPerson && proposalPerson.person) {
      if (proposalPerson.person.classification.value == PersonClassifierEnum.physical) {
        return this.cpfPipe.transform(proposalPerson.person.cpf);
      } else if (proposalPerson.person.classification.value == PersonClassifierEnum.legal) {
        return this.cnpjPipe.transform(proposalPerson.person.cnpj);
      } else {
        return proposalPerson.person.rne;
      }
    }
  }

  getPaymentPortions() {
    let paymentPortion = null;
    if (this.proposal && this.proposal.proposalPayment && this.proposal.proposalPayment.length > 0) {
      if (this.proposal.proposalPayment[0] && this.proposal.proposalPayment[0].paymentRule && this.proposal.proposalPayment[0].paymentRule.installments) {
        paymentPortion = this.proposal.proposalPayment[0].paymentRule.installments;
      }
    }
    return paymentPortion;
  }

  calculatePaymentPorcent(proposalPayment: ProposalPayment) {
    if (this.proposal && this.proposal.proposalDetailVehicle && this.proposal.proposalDetailVehicle.totalAmount && proposalPayment) {
      return ((proposalPayment.paymentAmount) * 100 / this.proposal.proposalDetailVehicle.totalAmount);
    }
    return 0;
  }
}
