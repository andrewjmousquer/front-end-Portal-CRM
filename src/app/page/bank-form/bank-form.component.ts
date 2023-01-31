import { NgForm } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";

import { first } from "rxjs/operators";

import { BankFormService } from "./bank-form.service";
import { Bank } from "src/app/shared/model/bank.model";

import { ConfirmationService, MessageService } from "primeng/api";
import { StatusDictionary } from "src/app/shared/dictionary/status.dictionary";
import { Status } from "src/app/shared/model/status.model";

@Component({
  selector: 'app-bank-form',
  templateUrl: './bank-form.component.html'
})
export class BankFormComponent implements OnInit {

  isEdit: boolean = false;
  cols: any[];

  bankList: Bank[];
  bankSearch: Bank;
  bankRegister: Bank;

  statusList: Status[];
  selectedStatus: Status;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('bankRegisterForm', { static: false }) bankRegisterForm: NgForm;

  constructor(
    private messageService: MessageService,
    private bankFormService: BankFormService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'code', header: 'Codigo' },
      { field: 'active', header: 'Situação' }
    ];

    this.bankRegister = new Bank();
    this.bankList = new Array<Bank>();
    this.statusList = StatusDictionary;
    this.resetRegisterForm();
  }

  loadBank() {
    this.bankFormService.getAll().pipe(first()).subscribe(data => {
      this.bankList = data;
    });
  }

  resetSearchForm() {
    this.loadBank();
    this.bankSearch = new Bank();
  }

  resetRegisterForm() {
    this.resetSearchForm();
    this.isEdit = false;
    this.bankRegister = new Bank();
    this.bankRegisterForm && this.bankRegisterForm.reset();
    this.selectedStatus = StatusDictionary[0];
  }

  search(event) {
    if (event && event.first) {
      this.bankSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.bankSearch.first = 0;
    }
    
    this.bankFormService.search(this.bankSearch).pipe(first()).subscribe(data => {
      this.bankList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    this.isEdit = true;
    this.bankFormService.getById(this.bankRegister.id).pipe(first()).subscribe(data => {
      this.bankRegister = data;
      this.selectedStatus = this.statusList.filter(item => item.code == this.bankRegister.active)[0];
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(Bank: Bank) {
    this.confirmationService.confirm({
      message: `Deseja remover ${Bank.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.bankFormService.delete(Bank.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com Sucesso!', detail: 'Registro removido com sucesso!' });
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    })
  }

  save() {
    this.bankRegister.active = this.selectedStatus.code;
    let method = this.bankRegister.id ? 'update' : 'save';
    let message = this.bankRegister.id ? 'atualizado' : 'adicionado';

    this.bankFormService[method](this.bankRegister).pipe(first()).subscribe(data => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Salvo com sucesso',
        detail: `Registro ${message} com sucesso!`
      });
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }
}
