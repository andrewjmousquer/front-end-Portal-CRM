import { Component, OnInit, TRANSLATIONS, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

import { CheckpointService } from 'src/app/shared/service/checkpoint.service';

import { Classifier } from '../../shared/model/classifier.model';
import { Checkpoint } from 'src/app/shared/model/checkpoint.model';

import { Sale } from 'src/app/shared/model/sale.model';
import { User } from 'src/app/shared/model/user.model';

import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ExportService } from 'src/app/shared/service/export.service';
import { HistoryService } from './history-form.service';
import { UserService } from 'src/app/shared/service/user.service';

import { Utils } from 'src/app/shared/util/util';

@Component({
  selector: 'app-history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css']
})
export class HistoryFormComponent implements OnInit {

  totalRecords = 0;
  loading = true;
  hasRemovePermission = false;

  saleSearch: Sale;
  saleList: Sale[];
  paymentTypeList: Classifier[];
  paymentType: Classifier;
  checkpointList: Checkpoint[];
  userList: User[];

  cols: any[];

  @ViewChild('dt', { static: false }) dt: any;

  constructor(private historyService: HistoryService,
              private classifierService: ClassifierService,
              private checkpointService: CheckpointService,
              private userService: UserService,
              private messageService: MessageService,
              private exportService: ExportService,
              private datePipe: DatePipe,
              private utils: Utils) { }

  ngOnInit() {

    this.cols = [
      { field: 'date', header: 'Data', width: '10%' },
      { field: 'customer', header: 'Cliente', width: '20%' },
      { field: 'paymentType', header: 'Tipo de Pagamento', width: '10%' },
      { field: 'value', header: 'Valor', width: '10%' },
      { field: 'firstPayment', header: 'Entrada', width: '10%' },
      { field: 'portion', header: 'Parcelas', width: '10%' },
      { field: 'tax', header: 'Taxa', width: '10%' },
      { field: 'user.person.name', header: 'Vendedor', width: '20%' }
    ];

    this.resetSearchForm();
    this.loadUserList();
    this.loadPaymentTypeList();
    this.loadCheckpointList();
  }

  resetSearchForm() {
    this.saleSearch = new Sale();
    this.search(null);
  }

  loadUserList() {
    this.userService.getAll().pipe(first()).subscribe(data => {
      this.userList = data ? data : [];
    });
  }

  loadPaymentTypeList() {
    this.classifierService.searchByType('PAYMENT_TYPE').pipe(first()).subscribe(data => {
      this.paymentTypeList = data ? data : [];
    });
  }

  loadCheckpointList() {
    this.checkpointService.getByCurrentUser().pipe(first()).subscribe(data => {
      this.checkpointList = data ? data : [];
      this.hasRemovePermission = this.checkpointList.filter(checkpoint => checkpoint.name === 'PORTAL_CAN_DELETE_SALE').length > 0;
    });
  }

  search(event) {
    this.loading = true;

    if (event && event.first) {
      this.saleSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 1;
      this.saleSearch.first = 0;
    }

    if (this.paymentType != undefined) {
      this.saleSearch.paymentType = this.paymentType.value;
    }

    this.historyService.search(this.saleSearch).pipe(first()).subscribe(data => {
      this.saleList = this.normalizeDate(data);
      this.historyService.getTotalRecords(this.saleSearch).pipe(first()).subscribe(data => {
        this.totalRecords = data;
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  exportExcel() {
    this.loading = true;
    let exportSearchFilter = Object.assign({}, this.saleSearch);
    exportSearchFilter.first = null;
    this.historyService.search(exportSearchFilter).pipe(first()).subscribe(data => {
      this.exportService.exportAsExcelFile(this.prepareToExcelExport(this.normalizeDate(data)), 'vendas');
      this.loading = false;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  exportPdf() {
    this.loading = true;
    let exportSearchFilter = Object.assign({}, this.saleSearch);
    exportSearchFilter.first = null;

    this.historyService.search(exportSearchFilter).pipe(first()).subscribe(data => {
      let head = ['Data', 'Cliente', 'Tipo de Pagamento', 'Valor', 'Entrada', 'Parcelas', 'Taxa', 'Vendedor'];
      this.exportService.exportAsPdfFile(head, this.prepareToPdfExport(data), 'vendas', 'Carbon');
      this.loading = false;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  cancel(sale: Sale) {
    this.loading = true;
    this.historyService.delete(sale.id).pipe(first()).subscribe(data => {
      this.resetSearchForm();
      this.loading = false;
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: 'Venda cancelada com sucesso' });
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  private normalizeDate(list: Sale[]) {
    if (list) {
      list.forEach(history => {
        history.date = new Date(history.date);
      });
    }
    return list;
  }

  private prepareToExcelExport(list: Sale[]) {
    let json = [];

    list.forEach(history => {
      json.push({
        'Data': this.datePipe.transform(new Date(history.date), 'dd/MM/yyyy'),
        'Cliente': history.customer,
        'Tipo de Pagamento': history.paymentType,
        'Valor': history.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        'Entrada': history.firstPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        'Parcelas': history.portion,
        'Taxa': history.tax,
        'Vendedor': history.user.person.name
      });
    });

    return json;
  }

  private prepareToPdfExport(list: Sale[]) {
    let body = [];
    list.forEach(history => {
      body.push([
        this.datePipe.transform(new Date(history.date), 'dd/MM/yyyy'),
        history.customer,
        history.paymentType,
        history.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        history.firstPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        history.portion,
        history.tax,
        history.user.person.name
      ]);
    });

    return body;
  }
}
