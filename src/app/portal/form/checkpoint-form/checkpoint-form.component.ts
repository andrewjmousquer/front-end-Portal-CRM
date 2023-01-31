import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as _ from "lodash";

import { CheckpointFormService } from '../checkpoint-form/checkpoint-form.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccessListService } from '../../../shared/service/access-list.service';
import { ClassifierService } from '../../../shared/service/classifier.service';

import { Checkpoint } from '../../../shared/model/checkpoint.model';

@Component({
  selector: 'wbp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html'
})
export class CheckpointFormComponent implements OnInit {
  loading = false;
  isEdit: boolean = false;

  checkpointList: Checkpoint[];
  checkpointSearch: Checkpoint;
  checkpointRegister: Checkpoint;

  cols: any[];

  @ViewChild('checkpointRegisterForm', { static: false }) checkpointRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private accesslistService: AccessListService,
    private checkpointFormService: CheckpointFormService,
    private classifierService: ClassifierService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadCheckpoints() {
    this.checkpointFormService.getAll().pipe(first()).subscribe(data => {
      this.checkpointList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadCheckpoints();
    this.checkpointSearch = new Checkpoint();
  }

  search(event) {
    if (event && event.first) {
      this.checkpointSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.checkpointSearch.first = 0;
    }

    this.checkpointFormService.search(this.checkpointSearch).pipe(first()).subscribe(data => {
      this.checkpointList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    let checkpoint = event.data;
    this.resetRegisterForm();
    this.isEdit = true;

    this.checkpointFormService.getById(checkpoint.id).pipe(first()).subscribe(data => {
      this.checkpointRegister = data;

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(checkpoint: Checkpoint) {
    this.confirmationService.confirm({
      message: `Deseja remover ${checkpoint.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.checkpointFormService.delete(checkpoint.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
          this.checkpointRegisterForm.reset();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    this.checkpointFormService.save(this.checkpointRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
      this.checkpointRegisterForm.reset();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.checkpointRegister = new Checkpoint();
    this.isEdit = false;
  }
}
