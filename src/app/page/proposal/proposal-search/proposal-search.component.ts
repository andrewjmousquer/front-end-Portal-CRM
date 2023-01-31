import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { Brand } from 'src/app/shared/model/brand.model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Model } from 'src/app/shared/model/model.model';
import { PartnerGroup } from 'src/app/shared/model/partner-group.model';
import { Partner } from 'src/app/shared/model/partner.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProposalList } from 'src/app/shared/model/proposal-list';
import { ProposalSearch } from 'src/app/shared/model/proposal-search';
import { Seller } from 'src/app/shared/model/seller.model';
import { StatusProposal } from 'src/app/shared/model/status-proposal';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ParameterService } from 'src/app/shared/service/parameter.service';
import { ProposalService } from 'src/app/shared/service/proposal.service';
import { UserUtil } from 'src/app/shared/util/user.util';
import { BrandFormService } from '../../brand-form/brand-form.service';
import { ModelFormService } from '../../model-form/model-form.service';
import { PartnerGroupFormService } from '../../partner-group-form/partner-group-form.service';
import { ProposalViewComponent } from '../proposal-view/proposal-view.component';
import { ProposalSearchService } from './proposal-search.service';

@Component({
  selector: 'app-proposal-search',
  templateUrl: './proposal-search.component.html',
  styleUrls: ['./proposal-search.component.css']
})
export class ProposalSearchComponent implements OnInit {

  cols: any[];
  dateType: any[];
  immediateDelivery: any[];

  displayModal: boolean;

  immediateDeliverySearch;

  statusProposalList: Classifier[];
  selectedProposalSearchModel: Model = new Model();

  brandSearchList: Brand[] = new Array<Brand>();
  modelSearchList: Model[] = new Array<Model>();

  proposalRegister: ProposalList = new ProposalList();
  proposalList: ProposalList[];

  proposalSearch: ProposalSearch = new ProposalSearch();
  proposalSearchStatus: StatusProposal[];

  partnerRegister: Partner = new Partner();
  partnerList: Partner[];

  executiveRegister: Seller = new Seller();
  executiveList: Seller[];

  partnerGroupRegister: PartnerGroup = new PartnerGroup();
  partnerGroupList: PartnerGroup[];

  proposal: ProposalDTO = new ProposalDTO();

  proposalDaysLimit: number;

  valFollowup: number;
  valD7: number;
  valD1: number;

  nproposta: string;

  userUtil: any = UserUtil;

  @ViewChild('proposalSearchForm', { static: false }) proposalSearchForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private proposalService: ProposalSearchService,
    private brandService: BrandFormService,
    private modelService: ModelFormService,
    private partnerGroupService: PartnerGroupFormService,
    private classifierService: ClassifierService,
    private proposalServiceGet: ProposalService,
    private parameterService: ParameterService,
    private dialogService: DialogService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'statusCla', header: 'Status' },
      { field: 'client', header: 'Cliente' },
      { field: 'num', header: 'Proposta' },
      { field: '', header: 'Pedido' },
      { field: 'partner', header: 'Parceiro' },
      { field: 'executive', header: 'Executivo de Negócio' },
      { field: 'brandModel', header: 'Modelo | Marca' },
      { field: 'createDate', header: 'Data Criação' },
      { field: 'validityDate', header: 'Validade' },
      { field: 'totalPrice', header: 'Valor Total' }
    ];

    this.dateType = [
      { id: 'creationDate', label: 'Data Criação' },
      { id: 'validateDate', label: 'Data Validade' }
    ];

    this.immediateDelivery = [
      { id: 'true', label: 'Sim' },
      { id: 'false', label: 'Não' },
    ];

    this.loadPartnerList();
    this.loadExecutiveList();
    this.loadPartnerGroup();
    this.loadStatusProposalList();

    this.loadSearchBrandList();
    this.searchProposalList(null);
  }

  loadStatusProposalList() {
    this.classifierService.searchByType(ClassifierEnum.PROPOSAL_STATUS).pipe(first()).subscribe(data => {
      this.statusProposalList = data;
      this.statusProposalList.sort((a, b) => (a.id < b.id ? -1 : 1));
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPartnerList() {
    this.proposalService.getParnerList().pipe(first()).subscribe(data => {
      this.partnerList = data ? data : [];
    });
  }

  loadSearchBrandList() {
    this.brandService.getAll().pipe(first()).subscribe(data => {
      this.brandSearchList = data ? data : [];
    });
  }

  loadSearchModelList() {
    if(this.proposalSearch.brand){
      this.modelService.getAllByBrand(this.proposalSearch.brand.id).pipe(first()).subscribe(data => {
        this.modelSearchList = data ? data : [];
      });
    } else {
      this.modelSearchList = [];
      this.proposalSearch.model = [];
    }
  }

  loadExecutiveList() {
    this.proposalService.getExecutiveList().pipe(first()).subscribe(data => {
      this.executiveList = data ? data : [];
    });
  }

  loadPartnerGroup() {
    this.partnerGroupService.getAll().pipe(first()).subscribe(data => {
      this.partnerGroupList = data ? data : [];
    });
  }

  getProposalStatusName(statusId) {
    return this.statusProposalList?.find(s => s.id === statusId).label;
  }

  getProposalStatusColor(statusId) {
    let styles = {};

    if (statusId == 61) {
      styles['background-color'] = '#aaaaaa';
    } else if (statusId == 68) {
      styles['background-color'] = '#333333';

    } else if (statusId == 62 || statusId == 65) {
      styles['background-color'] = '#FFA700';

    } else if (statusId == 63 || statusId == 66) {
      styles['background-color'] = '#E30705';

    } else if (statusId == 64 || statusId == 67) {
      styles['background-color'] = '#129C11';
    }

    return styles;
  }

  getValidityDateColor(validityDays: number, statusId: number) {
    let styles = {};
    // apenas propostas Em Andamento ou Em Aprovação Comercial
    if (statusId == 61 || statusId == 62) {
      if (validityDays <= 0 && validityDays > -4)
        styles['color'] = '#faa606';
      else if (validityDays > 0)
        styles['color'] = '#c3393c';
    }
    return styles;
  }

  getValidityDaysColor(daysFollowUp: number, statusId: number) {
    let styles = {};
    if (statusId == 61 || statusId == 62) {
      if (daysFollowUp) {
        styles['color'] = '#8439e3';
      }
    }
    return styles;
  }

  searchProposalList(event) {
    if (event && event.first) {
      this.proposalSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.proposalSearch.first = 0;
    }

    this.proposalSearch.status = [];
    if (this.proposalSearchStatus != null) {
      this.proposalSearchStatus.forEach(item => {
        let id: string = item.id.toString();
        this.proposalSearch.status.push(id);
      });
    }

    this.proposalSearch.partner = this.proposalSearch.partner === undefined ? null : this.proposalSearch.partner;
    this.proposalSearch.proposalnum = this.proposalSearch.proposalnum === undefined ? null : this.proposalSearch.proposalnum;
    this.proposalSearch.ordernum = this.proposalSearch.ordernum === undefined ? null : this.proposalSearch.ordernum;
    this.proposalSearch.name = this.proposalSearch.name === undefined ? null : this.proposalSearch.name
    this.proposalSearch.executive = this.proposalSearch.executive === undefined ? [] : this.proposalSearch.executive
    this.proposalSearch.brand = this.proposalSearch.brand === undefined ? null : this.proposalSearch.brand
    this.proposalSearch.model = this.proposalSearch.model === undefined ? null : this.proposalSearch.model
    this.proposalSearch.partnerGroup = this.proposalSearch.partnerGroup === undefined ? null : this.proposalSearch.partnerGroup;
    this.proposalSearch.dateIni = this.proposalSearch.dateIni === undefined ? null : this.proposalSearch.dateIni
    this.proposalSearch.dateEnd = this.proposalSearch.dateEnd === undefined ? null : this.proposalSearch.dateEnd

    this.resetValuesChip();
    this.proposalService.search(this.proposalSearch).pipe(first()).subscribe(data => {
      this.proposalList = data;

      let valFollowupList = this.proposalList.filter(p => p.daysFollowUp != null);
      let valD7List = this.proposalList.filter(p => p.validityDays <= 0 && p.validityDays > -4);
      let valD1List = this.proposalList.filter(p => p.validityDays > 0);

      this.valFollowup = valFollowupList.length;
      this.valD7 = valD7List.length;
      this.valD1 = valD1List.length;

      if (this.proposalSearch.valFollowup) {
        this.proposalList = valFollowupList;
        this.proposalSearch.valFollowup = false;
      }

      if (this.proposalSearch.valD7) {
        this.proposalList = valD7List;
        this.proposalSearch.valD7 = false;
      }

      if (this.proposalSearch.valD1) {
        this.proposalList = valD1List;
        this.proposalSearch.valD1 = false;
      }

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

  }

  resetSearchForm() {
    this.proposalSearchForm.reset();
    this.proposalSearchStatus = [];
    this.proposalSearch.partner = [];
    this.proposalSearch.executive = [];
    this.proposalSearch.model = [];
    this.proposalSearch.partnerGroup = [];
    this.loadSearchBrandList();
    this.resetValuesChip();
    this.searchProposalList(null);
  }

  resetSearchFilter() {
    this.proposalSearchStatus = [];
    this.proposalSearch.proposalnum = null;
    this.proposalSearch.ordernum = null;
    this.proposalSearch.name = null;
    this.proposalSearch.dateType = null;
    this.proposalSearch.dateIni = null;
    this.proposalSearch.dateEnd = null;
  }

  resetValuesChip() {
    this.valFollowup = 0;
    this.valD7 = 0;
    this.valD1 = 0;
  }

  editRegisterProposal(id) {
    this.router.navigate(['/proposal-form/', id]);
  }

  openRegisterProposal() {
    this.router.navigate(['/proposal-form']);
  }

  filterByValFollowup() {
    this.resetSearchFilter();
    this.filterByVal(true, false, false);
  }

  filterByValD3() {
    this.resetSearchFilter();
    this.filterByVal(false, true, false);
  }

  filterByValD1() {
    this.resetSearchFilter();
    this.filterByVal(false, false, true);
  }

  private filterByVal(followup: boolean = false, d7: boolean = false, d1: boolean = false) {
    this.proposalSearch.valFollowup = followup;
    this.proposalSearch.valD7 = d7;
    this.proposalSearch.valD1 = d1;
    this.searchProposalList(null);
  }

  openModal(proposal: Proposal): void {
    const ref = this.dialogService.open(ProposalViewComponent, {
      header: 'Proposta',
      width: '70%',
      data: {
        proposal: proposal
      }
    });
  }

}
