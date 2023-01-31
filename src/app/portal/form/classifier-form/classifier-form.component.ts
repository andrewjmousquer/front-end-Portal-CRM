import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ClassifierFormService } from './classifier-form.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';

import { Classifier } from '../../../shared/model/classifier.model';

@Component({
  selector: 'wbp-classifier-form',
  templateUrl: './classifier-form.component.html'
})
export class ClassifierFormComponent implements OnInit {
  loading = false;
  isEdit: boolean = false;

  classifierList: Classifier[];
  items: MenuItem[];
  cols: any[];

  home: MenuItem;
  classifierSearch: Classifier;
  classifierRegister: Classifier;

  @ViewChild('classifierRegisterForm', { static: false }) classifierRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private classifierFormService: ClassifierFormService) { }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'value', header: 'Nome' },
      { field: 'type', header: 'Tipo' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadClassifier() {
    this.classifierFormService.getAll().pipe(first()).subscribe(data => {
      this.classifierList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadClassifier();
    this.classifierSearch = new Classifier();
  }

  search(event) {
    if (event && event.first) {
      this.classifierSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.classifierSearch.first = 0;
    }

    this.classifierFormService.searchByNameOrType(this.classifierSearch).pipe(first()).subscribe(data => {
      this.classifierList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    let classifier = event.data;
    this.resetRegisterForm();
    this.isEdit = true;

    this.classifierFormService.getById(classifier.id).pipe(first()).subscribe(data => {
      this.classifierRegister = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(classifier: Classifier) {
    this.confirmationService.confirm({
      message: `Deseja remover ${classifier.value}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.classifierFormService.delete(classifier.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
          this.classifierRegisterForm.reset();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    this.classifierFormService.save(this.classifierRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
      this.classifierRegisterForm.reset();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.classifierRegister = new Classifier();
    this.isEdit = false;
  }
}
