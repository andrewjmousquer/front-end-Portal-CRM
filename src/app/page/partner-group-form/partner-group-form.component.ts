import { Component, OnInit, ViewChild } from '@angular/core';
import { PartnerGroupFormService } from './partner-group-form.service';
import { Parameter } from '../../shared/model/parameter.model';
import { first } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { Status } from 'src/app/shared/model/status.model';
import { StatusDictionary } from 'src/app/shared/dictionary/status.dictionary';
import { PartnerGroup } from 'src/app/shared/model/partner-group.model';

@Component({
  selector: 'wbp-partner-group-form',
  templateUrl: './partner-group-form.component.html',
})
export class PartnerGroupFormComponent implements OnInit {

  isEdit = false;
  cols: any[];

  partnerList: PartnerGroup[];
  partnerSearch: PartnerGroup;
  partnerRegister: PartnerGroup;

  statusList: Status[];
  selectedStatus: Status;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('partnerRegisterForm', { static: false }) partnerRegisterForm: NgForm;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private partnerFormService: PartnerGroupFormService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'active', header: 'Situação' }
    ];

    this.partnerList = new Array<PartnerGroup>();
    this.statusList = StatusDictionary;
    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadPartners() {
    this.partnerFormService.getAll().pipe(first()).subscribe(data => {
      this.partnerList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.partnerSearch = new PartnerGroup();
    this.loadPartners();
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.partnerRegister = new PartnerGroup();
    this.partnerRegisterForm && this.partnerRegisterForm.reset();
    this.selectedStatus = StatusDictionary[0];
  }

  search(event) {
    if (event && event.first) {
      this.partnerSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.partnerSearch.first = 0;
    }

    this.partnerFormService.search(this.partnerSearch).pipe(first()).subscribe(data => {
      this.partnerList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    this.isEdit = true;
    this.partnerFormService.getById(this.partnerRegister.id).pipe(first()).subscribe(data => {
      this.partnerRegister = data;
      this.selectedStatus = this.statusList.filter(item => item.code == this.partnerRegister.active)[0];
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(parameter: Parameter) {
    this.confirmationService.confirm({
      message: `Deseja remover ${parameter.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.partnerFormService.delete(parameter.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    this.partnerRegister.active = this.selectedStatus.code;
    let method = this.partnerRegister.id ? 'update' : 'save';
    let message = this.partnerRegister.id ? 'atualizado' : 'adicionado';

    this.partnerFormService[method](this.partnerRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }
}
