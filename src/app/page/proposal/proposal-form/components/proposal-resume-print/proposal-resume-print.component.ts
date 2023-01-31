import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ExportService } from 'src/app/shared/service/export.service';

import { CurrencyFormatPipe } from 'src/app/shared/pipe/currency.pipe';
import { DatePipe } from '@angular/common';
import { PhonePipe } from 'src/app/shared/pipe/phone.pipe';

import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { ProposalDetailVehicleItem } from 'src/app/shared/model/proposal-detail-vehicle-item.dto';
import { ProposalPayment } from 'src/app/shared/model/proposal-payment.model';
import { Person } from 'src/app/shared/model/person.model';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { CpfPipe } from 'src/app/shared/pipe/cpf.pipe';
import { CnpjPipe } from 'src/app/shared/pipe/cnpj.pipe';
import { ContactEnum } from 'src/app/shared/enum/contact-enum';
import { ProposalPerson } from 'src/app/shared/model/proposal-person';
import { ProposalCommission } from 'src/app/shared/model/proposal-commission';

@Component({
  selector: 'wbp-proposal-resume-print',
  templateUrl: './proposal-resume-print.component.html',
  styleUrls: ['./proposal-resume-print.component.css']
})
export class ProposalResumePrintComponent implements OnInit {

  @ViewChild('pdfContent', { static: false }) pdfContent: ElementRef;

  proposal: ProposalDTO;

  listPerson: ProposalPerson[];
  listContact: any[];
  listProduct: ProposalDetailVehicleItem[];
  listCommission: ProposalCommission[];
  listFinancial: ProposalPayment[];

  colHeader: any[];
  colPerson: any[];
  colContact: any[];
  colProducts: any[];
  colFinancials: any[];
  colCommissionTotals: any[];
  colCommissionItems: any[];

  constructor(private dialog : DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig,
              private exportService: ExportService,
              private cpfPipe: CpfPipe,
              private cnpjPipe: CnpjPipe,
              private phonePipe: PhonePipe,
              private currencyBRPipe: CurrencyFormatPipe,
              private datePipe: DatePipe,
              ) { }

  async ngOnInit() {

    this.listPerson = [];
    this.listContact = [];
    this.listProduct = []
    this.listCommission = [];
    this.listFinancial = [];

    this.colHeader = [
      { field: 'cod', header: 'Nº Proposta', align: 'left'},
      { field: 'status', header: 'Status', align: 'center'},
      { field: 'createdAt', header: 'Criação', align: 'center'},
      { field: 'expiredAt', header: 'Validade', align: 'center'},
      { field: 'immediateDelivery', header: 'Pronta Entrega', align: 'center' },
    ];

    this.colPerson = [
      { field: 'name', header: 'Nome', width: '30%', align: 'left' },
      { field: 'classification', header: 'Tipo', width: '10%', align: 'center' },
      { field: 'document', header: 'Documento', width: '20%', align: 'center' },
      { field: 'paper', header: 'Papel', width: '20%', align: 'center' },
    ];

    this.colContact = [
      { field: 'contact', header: '', width: '18%', align: 'left' },
      { field: 'name', header: 'Nome', width: '30%', align: 'center' },
      { field: 'email', header: 'E-mail', width: '32%', align: 'center' },
      { field: 'phone', header: 'Telefone', width: '20%', align: 'center' },
    ];

    this.colProducts = [
      { field: 'itemType', header: 'Tipo de Item' },
      { field: 'configuration', header: 'Configuração' },
      { field: 'item', header: 'Item' },
      { field: 'priceList', header: 'Preço Tabela' },
      { field: 'discount', header: 'Desconto' },
      { field: 'courtesy', header: 'Cortesia' },
      { field: 'price', header: 'Preço' }
    ];

    this.colFinancials = [
      { field: 'payer', header: 'Pagador' },
      { field: 'event', header: 'Evento' },
      { field: 'days', header: 'Qtde. Dias' },
      { field: 'dueDate', header: 'Data Pactuada' },
      { field: 'paymentAmount', header: 'Valor' },
      { field: 'percent', header: 'Porcent.' },
      { field: 'paymentMethod', header: 'Meio de Pagamento' },
      { field: 'installments', header: 'Parcelas' },
      { field: 'installmentsValue', header: 'Valor da Parcela' },
      { field: 'fees', header: 'Juros' }
    ];

    this.colCommissionItems = [
      { field: 'type', header: 'Tipo', style: {'text-align': 'left', 'width': '15%'}},
      { field: 'name', header: 'Nome', style: {'text-align': 'left', 'width': '25%'}},
      { field: 'amount', header: 'Valor', style: {'text-align': 'right', 'width': '15%'}},
      { field: 'dueDate', header: 'Vencimento', style: {'text-align': 'left', 'width': '10%'}},
      { field: 'commision', header: 'Comissão', style: {'text-align': 'left', 'width': '20%'}},
      { field: 'notes', header: 'Obs', style: {'text-align': 'left', 'width': '15%'}},
    ];

    await this.initProposal();
  }

  print() {
    let fileName = 'proposta_' + this.proposal.proposal.num +'_'+ this.datePipe.transform(new Date(), 'dd_MM_yyyy_HH_mm_ss') ;
    this.exportService.htmlToPdf(this.pdfContent?.nativeElement, fileName);

    setTimeout(() => {
    }, 3000);
  }

  close() {
    this.dialog.close();
  }

  initProposal() {
    return new Promise(resolve => {
      
      this.proposal = this.dialogConfig?.data ? this.dialogConfig?.data : new ProposalDTO();

      if (this.proposal && this.proposal.proposal) {

        if(this.proposal.proposal.personList && this.proposal.proposal.personList.length > 0){
          this.listPerson = this.proposal.proposal.personList;
        }

        if(this.proposal.proposal.proposalDetailVehicleItem && this.proposal.proposal.proposalDetailVehicleItem.length > 0){
          this.listProduct = this.proposal.proposal.proposalDetailVehicleItem;
        }

        if(this.proposal.proposal.proposalCommission && this.proposal.proposal.proposalCommission.length > 0){
          this.listCommission = this.proposal.proposal.proposalCommission;
        }

        if(this.proposal.proposal.proposalPayment && this.proposal.proposal.proposalPayment.length > 0){
          this.listFinancial = this.proposal.proposal.proposalPayment;
        }

        if(!this.proposal?.proposal?.documentContact){
          this.listContact.push({
            contact: 'Documentação',
            name: this.proposal?.proposal?.documentContactName,
            email: this.proposal?.proposal?.documentContactEmail,
            phone: this.phonePipe.transform(this.proposal?.proposal?.documentContactPhone)
          });
        } 
          
        if (!this.proposal?.proposal?.finantialContact) {
          this.listContact.push({
            contact: 'Financeiro',
            name: this.proposal?.proposal?.finantialContactName,
            email: this.proposal?.proposal?.finantialContactEmail,
            phone: this.phonePipe.transform(this.proposal?.proposal?.finantialContactPhone)
          });
        }
    
        this.proposal.proposal.personList.forEach(record => {
          if(record.person.contacts && record.person.contacts.length > 0){
            this.listContact.push({
              contact: record.proposalPersonClassification.value,
              name: record?.person?.name,
              email: (record.person.contacts ? record.person.contacts.find(c => c.type && c.type.value == ContactEnum.EMAIL)?.value : null),
              phone: this.phonePipe.transform(
                record.person.contacts ? record.person.contacts.find(c => c.type && (c.type.value == ContactEnum.CELULAR || c.type.value == ContactEnum.TELEFONE))?.value : null
              )
            });
          }
        });
      }

      resolve(true);
    });
  }

  getPaymentPortions(){
    let paymentPortion = null;
    if(this.proposal && this.proposal.proposal.proposalPayment && this.proposal.proposal.proposalPayment.length > 0){
      if(this.proposal.proposal.proposalPayment[0] && this.proposal.proposal.proposalPayment[0].paymentRule && this.proposal.proposal.proposalPayment[0].paymentRule.installments){
        paymentPortion = this.proposal.proposal.proposalPayment[0].paymentRule.installments;
      }
    }
    return paymentPortion;
  }

  getDocumentValue(proposalPerson: ProposalPerson) {
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

  calculatePaymentPorcent(proposalPayment: ProposalPayment){
    if(this.proposal && this.proposal.proposal.proposalDetailVehicle && this.proposal.proposal.proposalDetailVehicle.totalAmount && proposalPayment){
        return ((proposalPayment.paymentAmount) * 100 / this.proposal.proposal.proposalDetailVehicle.totalAmount);
    }
    return 0;
  }

}
