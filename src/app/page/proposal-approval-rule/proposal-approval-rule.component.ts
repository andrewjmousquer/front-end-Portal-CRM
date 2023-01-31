import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { JobService } from 'src/app/shared/service/job.service';
import { ProposalApprovalRuleFormService } from './proposal-approval-rule.service';

import { Job } from 'src/app/shared/model/job.model';
import { ProposalApprovalRule } from 'src/app/shared/model/proposal-approval-rule';

@Component({
  selector: 'portal-proposal-approval-rule',
  templateUrl: './proposal-approval-rule.component.html',
  styleUrls: ['./proposal-approval-rule.component.css']
})
export class ProposalApprovalRuleComponent implements OnInit {

  isEdit = false;
  cols: any[];

  jobList: Job[];

  searchValue: string;

  proposalAprovalRuleSearch: ProposalApprovalRule;
  proposalAprovalRuleRegister: ProposalApprovalRule;

  proposalApprovalRuleList: ProposalApprovalRule[];

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('proposalApprovalRuleRegisterForm', { static: false }) proposalApprovalRuleRegisterForm: NgForm;

  constructor(private confirmationService: ConfirmationService,
              private proposalApprovalRuleService: ProposalApprovalRuleFormService,
              private messageService: MessageService,
              private jobService: JobService) { 
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'job.name', header: 'Cargo' },
      { field: 'value', header: 'Valor' }
    ];

    this.proposalApprovalRuleList = new Array<ProposalApprovalRule>();

    this.loadJobList();
    this.resetSearchForm();
    this.resetRegisterForm();
   }

   resetSearchForm() {
    this.proposalAprovalRuleSearch = new ProposalApprovalRule();
    this.searchValue = null;
    this.loadProposalAprovalRule();
  }

  resetRegisterForm() {
    this.proposalAprovalRuleRegister = new ProposalApprovalRule();
    this.isEdit = false;
    this.proposalApprovalRuleRegisterForm && this.proposalApprovalRuleRegisterForm.reset();
  }

  loadJobList() {
    this.jobService.getAll().pipe(first()).subscribe(data => {
      this.jobList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  search(event) {
    if (event && event.first) {
      this.proposalAprovalRuleSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.proposalAprovalRuleSearch.first = 0;
    }

    let method = 'getAll';
    if(this.searchValue){
      method = 'search';
      this.proposalAprovalRuleSearch.job = new Job();
      this.proposalAprovalRuleSearch.job.name = this.searchValue;
      this.proposalAprovalRuleSearch.value = Number(this.searchValue);
    }

    if (method === 'getAll') {
      this.loadProposalAprovalRule();
    } else {
      this.proposalApprovalRuleService[method](this.proposalAprovalRuleSearch).pipe(first()).subscribe(data => {
        this.proposalApprovalRuleList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  loadProposalAprovalRule() {
    this.proposalApprovalRuleService.getAll().pipe(first()).subscribe(data => {
      this.proposalApprovalRuleList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  save() {
    let method = this.proposalAprovalRuleRegister.id ? 'update' : 'save';
    let message = this.proposalAprovalRuleRegister.id ? 'atualizado' : 'adicionado';

    this.proposalApprovalRuleService[method](this.proposalAprovalRuleRegister).pipe(first()).subscribe(data => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Salvo com sucesso',
        detail: `Registro ${message}  com sucesso!`
      });
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }
  

  edit() {
    this.isEdit = true;

    this.proposalApprovalRuleService.getById(this.proposalAprovalRuleRegister.id).pipe(first()).subscribe(data => {
      this.proposalAprovalRuleRegister = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(proposalAprovalRuleRegister: ProposalApprovalRule) {
    this.confirmationService.confirm({
      message: `Deseja remover ${proposalAprovalRuleRegister.job.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.proposalApprovalRuleService.delete(proposalAprovalRuleRegister.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }
}
