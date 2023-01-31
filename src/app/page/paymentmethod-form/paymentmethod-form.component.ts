import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';

import { first } from 'rxjs/operators';

import { Status } from 'src/app/shared/model/status.model';
import { StatusDictionary } from 'src/app/shared/dictionary/status.dictionary';
import { PaymentMethod } from 'src/app/shared/model/payment-method.model';
import { PaymentMethodService } from 'src/app/shared/service/payment-method.service';

@Component({
  selector: 'app-paymentmethod-form',
  templateUrl: './paymentmethod-form.component.html',
  styleUrls: ['./paymentmethod-form.component.css']
})
export class PaymentmethodFormComponent implements OnInit {

  isEdit = false;
  cols: any[];

  listModel: PaymentMethod[];

  searchModel: PaymentMethod;
  registerModel: PaymentMethod;

  statusList: Status[];
  selectedStatus: Status;

  @ViewChild('registerForm', { static: false }) registerForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private paymentMethodService: PaymentMethodService) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'active', header: 'Situação' }
    ];

    this.statusList = StatusDictionary;
    this.registerModel = new PaymentMethod();

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadPaymentMethod() {

    this.paymentMethodService.getAll().pipe(first()).subscribe(data => {
      this.listModel = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadPaymentMethod();
    this.searchModel = new PaymentMethod();
  }

  resetRegisterForm() {
 //   this.loadPaymentMethod();
    this.isEdit = false;
    this.registerModel = new PaymentMethod();
    this.searchModel = new PaymentMethod();
    this.registerForm && this.registerForm.reset();
    this.selectedStatus = StatusDictionary[0];
  }

  search(event) {
    if (event && event.first) {
      this.searchModel.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.searchModel.first = 0;
    }

    this.paymentMethodService.search(this.searchModel).pipe(first()).subscribe(data => {
      this.listModel = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(model: PaymentMethod) {
    this.confirmationService.confirm({
      message: `Deseja remover ${model.name}?`, header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.paymentMethodService.delete(model.id).pipe(first()).subscribe(data => {
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Removido com Sucesso!',
            detail: 'Registro removido com sucesso!'
          });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({
            key: 'tst', severity: 'error', summary: 'Erro',
            detail: error
          });
        });
      }
    });
  }

  edit(event) {
    this.isEdit = true;
    this.paymentMethodService.getById(this.registerModel.id).pipe(first()).subscribe(data => {
      this.registerModel = data;

      this.selectedStatus = this.statusList.filter(item => item.code == this.registerModel.active)[0];

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  save() {
    this.registerModel.active = this.selectedStatus.code;
    let method = this.registerModel.id ? 'update' : 'save';
    let message = this.registerModel.id ? 'atualizado' : 'adicionado';

    this.paymentMethodService[method](this.registerModel).pipe(first()).subscribe(data => {
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
}
