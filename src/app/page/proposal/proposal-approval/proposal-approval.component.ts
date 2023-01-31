import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { first } from "rxjs/operators";
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { MaskEnum } from 'src/app/shared/enum/mask-enum';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { Brand } from 'src/app/shared/model/brand.model';
import { Channel } from 'src/app/shared/model/channel-model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Model } from 'src/app/shared/model/model.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProposalApproval } from 'src/app/shared/model/proposal-approval';
import { ProposalApprovalFilter } from 'src/app/shared/model/proposal-approval-filter';
import { ProposalApprovalList } from 'src/app/shared/model/proposal-approval-list';
import { ProposalDetail } from 'src/app/shared/model/proposal-detail.dto';
import { Seller } from 'src/app/shared/model/seller.model';
import { ProposalApprovalService } from 'src/app/shared/service/proposal-approval.service';
import { ProposalService } from 'src/app/shared/service/proposal.service';
import { BrandFormService } from '../../brand-form/brand-form.service';
import { ModelFormService } from '../../model-form/model-form.service';
import { PartnerFormService } from '../../partner-form/partner-form.service';
import { SellerFormService } from '../../seller-form/seller-form.service';

@Component({
  selector: 'app-proposal-approval',
  templateUrl: './proposal-approval.component.html'
})
export class ProposalApprovalComponent implements OnInit {

  cols: any[];
  dateType: any[];

  list: ProposalApprovalList[] = [];
  displayModal: boolean;

  proposalApprovalFilter: ProposalApprovalFilter = new ProposalApprovalFilter();

  proposalApproval: ProposalApproval = new ProposalApproval();
  comment: string;

  brandList: Brand[];
  modelList: Model[];
  sellerList: Seller[];
  partnerList: Partner[];
  typeDateList: Classifier[];

  proposal: ProposalDTO = new ProposalDTO();

  selectedPartner: Partner;
  selectedBrand: Brand;
  selectedModel: Model;
  selectedSeller: Seller;
  selectedTypeDate: Classifier;

  nameSeller: string;

  maskEnum: any = MaskEnum;
  personClassifierEnum: any = PersonClassifierEnum;

  constructor(
    private messageService: MessageService,
    private proposalApprovalService: ProposalApprovalService,
    private proposalService: ProposalService,
    private sellerFormService: SellerFormService,
    private brandService: BrandFormService,
    private partnerFormService: PartnerFormService,
    private modelService: ModelFormService) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'client', header: 'Cliente' },
      { field: 'num', header: 'Proposta' },
      { field: 'partner', header: 'Parceiro' },
      { field: 'executive', header: 'Executivo de Conta' },
      { field: 'brandModel', header: 'Modelo | Marca' },
      { field: 'createDate', header: 'Criação' },
      { field: 'validityDate', header: 'Validade' },
      { field: 'totalPrice', header: 'Valor Total' },
      { filed: 'discount', header: 'Desconto' }

    ];

    this.dateType = [
      { id: 'creationDate', label: 'Data Criação' },
      { id: 'validateDate', label: 'Data Validade' }
    ];

    this.proposal.proposal = new Proposal();
    this.proposal.proposal.proposalDetail = new ProposalDetail();
    this.proposal.proposal.proposalDetail.channel = new Channel();
    this.proposal.proposal.riskClassification = new Classifier();

    this.resetSearchForm();

  }

  searchProposalApproval() {
    this.proposalApprovalService.find(this.proposalApprovalFilter).pipe(first()).subscribe(data => {
      this.list = data;
    });
  }

  resetSearchForm() {
    this.proposalApprovalFilter = new ProposalApprovalFilter();
    this.proposalApproval = new ProposalApproval();
    this.loadBrandList();
    this.loadSellerList();
    this.loadPartnerList();
    this.searchProposalApproval();

  }

  loadBrandList() {
    this.brandService.getAll().pipe(first()).subscribe(data => {
      this.brandList = data ? data : [];
    });
  }

  loadModelList() {
    if(this.proposalApprovalFilter && this.proposalApprovalFilter.brand && this.proposalApprovalFilter.brand.id){
      this.modelService.getAllByBrand(this.proposalApprovalFilter.brand.id).pipe(first()).subscribe(data => {
        this.modelList = data ? data : [];
      });
    }
  }

  loadSellerList() {
    this.sellerFormService.getAll().pipe(first()).subscribe(data => {
      this.sellerList = data ? data : [];
    });
  }

  loadPartnerList() {
    this.partnerFormService.getAll().pipe(first()).subscribe(data => {
      this.partnerList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  approve() {
    this.addProposalApproval('COMMERCIAL_APPROVED');
  }

  repprove() {
    this.addProposalApproval('COMMERCIAL_DISAPPROVED');
  }

  addProposalApproval(status: any) {
    this.proposalApproval.proposal = this.proposal.proposal;
    this.proposalApproval.status = status;
    this.proposalApproval.date = new Date();
    this.proposalApproval.comment = this.comment;

    this.proposal.proposal.proposalDetailVehicleItem.forEach(item => {
      this.proposalApproval.discount += item.amountDiscount;
    });
    this.proposalApproval.discount += this.proposal.proposal.proposalDetailVehicle.priceDiscountAmount;
    this.proposalApproval.discount += this.proposal.proposal.proposalDetailVehicle.productAmountDiscount;
    this.save();
  }

  save() {
    this.proposalApprovalService.save(this.proposalApproval).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.list = [];
      this.searchProposalApproval();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Atenção', detail: error });
      this.proposalApproval = new ProposalApproval();
      this.searchProposalApproval();

    });
    this.displayModal = false;
  }

  openModal(proposal: Proposal) {
    this.proposalService.getProposal(proposal.id).pipe(first()).subscribe(data => {
      this.proposal = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
    this.displayModal = true;
  }
}

