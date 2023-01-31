import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { PortionFormService } from './portion-form.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { Portion } from 'src/app/shared/model/portion.model';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { Classifier } from 'src/app/shared/model/classifier.model';

@Component({
  selector: 'app-portion-form',
  templateUrl: './portion-form.component.html'
})
export class PortionFormComponent implements OnInit {
  isEdit = false;
  portionList: Portion[];
  paymentTypeList: Classifier[];
  cols: any[];


  portionSearch: string = null;
  portionRegister: Portion = new Portion();

  @ViewChild('portionRegisterForm', { static: false }) portionRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private portionFormService: PortionFormService,
              private classifierService: ClassifierService) { }

  ngOnInit() {
    this.cols = [
      { field: 'paymentType.value', header: 'Tipo de Pagamento', value: 'paymentType' },
      { field: 'name', header: 'Parcela' },
      { field: 'tax', header: 'Juros' }
    ];

    this.loadPaymentTypes();
    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadPaymentTypes() {
    this.classifierService.searchByType("PAYMENT_TYPE").pipe(first()).subscribe(data => {
      this.paymentTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPaymentRules() {
    this.portionFormService.getAll().pipe(first()).subscribe(data => {
      this.portionList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadPortions(event) {
    this.portionFormService.search(this.portionSearch).pipe(first()).subscribe(data => {
      this.portionList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Não foi possível buscar a parcela.' });
    });
  }

  resetSearchForm() {
    this.loadPaymentRules();
    this.portionSearch = null;
  }

  resetRegisterForm() {
    this.portionRegister = new Portion();
    this.isEdit = false;
    this.portionRegisterForm && this.portionRegisterForm.reset();
  }

  edit(event) {
    let Portion = event.data;
    this.resetRegisterForm();
    this.isEdit = true;

    this.portionFormService.getById(Portion.id).pipe(first()).subscribe(data => {
      this.portionRegister = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(Portion: Portion) {
    this.confirmationService.confirm({
      message: `Deseja remover ${Portion.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.portionFormService.delete(Portion.id).pipe(first()).subscribe(data => {
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
    this.portionFormService.save(this.portionRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }
}
