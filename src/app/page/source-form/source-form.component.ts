import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { Source } from '../../shared/model/source.model';
import { SourceService } from '../../shared/service/source.service';
import { Status } from 'src/app/shared/model/status.model';
import { StatusDictionary } from 'src/app/shared/dictionary/status.dictionary';

@Component({
  selector: 'app-source-form',
  templateUrl: './source-form.component.html',
})
export class SourceFormComponent implements OnInit {

  isEdit = false;
  cols: any[];

  sourceList: Source[];

  sourceSearch: Source;
  sourceRegister: Source;

  statusList: Status[];
  selectedStatus: Status;

  @ViewChild('sourceRegisterForm', { static: false }) sourceRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private sourceService: SourceService) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'active', header: 'Situação' }
    ];

    this.statusList = StatusDictionary;
    this.sourceRegister = new Source();

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadSource() {

    this.sourceService.getAll().pipe(first()).subscribe(data => {
      this.sourceList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadSource();
    this.sourceSearch = new Source();
  }

  resetRegisterForm() {
  //  this.loadSource();
    this.isEdit = false;
    this.sourceRegister = new Source();
    this.sourceSearch = new Source();
    this.sourceRegisterForm && this.sourceRegisterForm.reset();
    this.selectedStatus = StatusDictionary[0];
  }

  search(event) {
    if (event && event.first) {
      this.sourceSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.sourceSearch.first = 0;
    }

    this.sourceService.search(this.sourceSearch).pipe(first()).subscribe(data => {
      this.sourceList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(source: Source) {
    this.confirmationService.confirm({
      message: `Deseja remover ${source.name}?`, header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.sourceService.delete(source.id).pipe(first()).subscribe(data => {
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
    this.sourceService.getById(this.sourceRegister.id).pipe(first()).subscribe(data => {
      this.sourceRegister = data;

      this.selectedStatus = this.statusList.filter(item => item.code == this.sourceRegister.active)[0];

    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  save() {
    this.sourceRegister.active = this.selectedStatus.code;
    let method = this.sourceRegister.id ? 'update' : 'save';
    let message = this.sourceRegister.id ? 'atualizado' : 'adicionado';

    this.sourceService[method](this.sourceRegister).pipe(first()).subscribe(data => {
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
