import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { PaymentruleFormService } from './paymentrule-form.service';
import { PaymentRule } from 'src/app/shared/model/payment-rule.model';
import { PaymentMethodService } from 'src/app/shared/service/payment-method.service';
import { PaymentMethod } from 'src/app/shared/model/payment-method.model';

@Component({
  selector: 'app-paymentrule-form',
  templateUrl: './paymentrule-form.component.html'
})
export class PaymentruleFormComponent implements OnInit {
  isEdit: boolean = false;
  paymentRuleList: PaymentRule[];
  paymentMethodList: PaymentMethod[];
  paymentMethodOriginalList: PaymentMethod[];
  cols: any[];

  selectPaymentMethod: PaymentMethod;
  searchPaymentRule: PaymentRule;

  paymentRuleSearch: PaymentRule = new PaymentRule();
  paymentRuleRegister: PaymentRule = new PaymentRule();

  @ViewChild('paymentRuleRegisterForm', { static: false }) paymentRuleRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private paymentRuleFormService: PaymentruleFormService,
    private paymentMethodService: PaymentMethodService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'paymentMethod.name', header: 'Meio de Pagamento' },
      { field: 'installments', header: 'Parcelas', class: 'justify-content-end' },
      { field: 'tax', header: 'Taxa', class: 'justify-content-end' },
      { field: 'active', header: 'Situação' },
      { field: 'preApproved', header: 'Pré Aprovado' }
    ];

    this.loadPaymentMethod();
    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadPaymentMethod() {
    this.paymentMethodService.getAll().pipe(first()).subscribe(data => {
      this.paymentMethodOriginalList = data;
      this.resetPaymentMethodList();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetPaymentMethodList(){
    if(this.paymentMethodOriginalList){
      this.paymentMethodList = this.paymentMethodOriginalList.filter( item => item.active);
    }
  }

  onClick(active: boolean) {
    if(!active) {
        event.stopPropagation();
    }
  }

  loadPaymentRules(event) {
    this.paymentRuleFormService.getAll().pipe(first()).subscribe(data => {
      this.paymentRuleList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  search(event) {
    if (event && event.first) {
      this.paymentRuleSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.paymentRuleSearch.first = 0;
    }

    let method = this.paymentRuleSearch.name ? 'find' : 'getAll';
    if (method === 'getAll') {
      this.loadPaymentMethod();
    } else {
      this.paymentRuleFormService[method](this.paymentRuleSearch).pipe(first()).subscribe(data => {
        this.paymentRuleList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  getLabelPaymentMethod(idMethod: number) {
    let method = this.paymentMethodList.filter(m => { return m.id == idMethod });
    if (method && method.length) {
      return method[0].name
    }
  }

  resetSearchForm() {
    this.loadPaymentRules(null);
    this.paymentRuleSearch = new PaymentRule();
  }

  resetRegisterForm() {
    this.paymentRuleRegister = new PaymentRule();
    this.isEdit = false;
    this.paymentRuleRegisterForm && this.paymentRuleRegisterForm.reset({
      active: true,
      preApproved: true
    });
    this.paymentRuleRegister.active = true;
    this.paymentRuleRegister.preApproved = true;

    this.resetPaymentMethodList();
  }

  edit() {
    this.isEdit = true;

    this.resetPaymentMethodList();

    this.paymentRuleFormService.getById(this.paymentRuleRegister.id).pipe(first()).subscribe(data => {
      this.paymentRuleRegister = data;

      if(!this.paymentRuleRegister.paymentMethod.active){
        this.paymentMethodList.push(this.paymentRuleRegister.paymentMethod);
        this.paymentMethodList.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(paymentRule: PaymentRule) {
    this.confirmationService.confirm({
      message: `Deseja remover ${paymentRule.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.paymentRuleFormService.delete(paymentRule.id).pipe(first()).subscribe(data => {
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
    let method = this.paymentRuleRegister.id ? 'update' : 'save';
    let message = this.paymentRuleRegister.id ? 'atualizado' : 'adicionado';

    this.paymentRuleFormService[method](this.paymentRuleRegister).pipe(first()).subscribe(data => {
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
}
