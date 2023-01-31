import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ParameterFormService } from './parameter-form.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';

import { Parameter } from '../../../shared/model/parameter.model';

@Component({
  selector: 'wbp-parameter-form',
  templateUrl: './parameter-form.component.html'
})
export class ParameterFormComponent implements OnInit {
  loading = false;
  isEdit: boolean = false;

  parameterList: Parameter[];
  items: MenuItem[];
  cols: any[];

  home: MenuItem;
  parameterSearch: Parameter;
  parameterRegister: Parameter;

  @ViewChild('parameterRegisterForm', { static: false }) parameterRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private parameterFormService: ParameterFormService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'value', header: 'Valor' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadParameters() {

    this.parameterFormService.getAll().pipe(first()).subscribe(data => {
      this.parameterList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadParameters();
    this.parameterSearch = new Parameter();
  }

  search(event) {
    if (event && event.first) {
      this.parameterSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.parameterSearch.first = 0;
    }

    this.parameterFormService.search(this.parameterSearch).pipe(first()).subscribe(data => {
      this.parameterList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    let parameter = event.data;
    this.resetRegisterForm();
    this.isEdit = true;

    this.parameterFormService.getById(parameter.id).pipe(first()).subscribe(data => {
      this.parameterRegister = data;
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
        this.parameterFormService.delete(parameter.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
          this.parameterRegisterForm.reset();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    this.parameterFormService.save(this.parameterRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
      this.parameterRegisterForm.reset();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.parameterRegister = new Parameter();
    this.isEdit = false;
  }
}
