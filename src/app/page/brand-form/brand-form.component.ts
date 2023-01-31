import { NgForm } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";

import { first } from "rxjs/operators";

import { ConfirmationService, MessageService } from "primeng/api";

import { BrandFormService } from "./brand-form.service";
import { Brand } from "src/app/shared/model/brand.model";
import { StatusDictionary } from "src/app/shared/dictionary/status.dictionary";
import { Status } from "src/app/shared/model/status.model";

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html'
})
export class BrandFormComponent implements OnInit {
  isEdit: boolean = false;

  cols: any[];

  brandList: Brand[];
  brandSearch: Brand;
  brandRegister: Brand;

  statusList: Status[];

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('brandRegisterForm', { static: false }) brandRegisterForm: NgForm;

  constructor(private messageService: MessageService,
              private brandFormService: BrandFormService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'active', header: 'Situação' }
    ];

    this.statusList = StatusDictionary;
    this.brandRegister = new Brand();

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  resetSearchForm() {
    this.loadBrand();
    this.brandSearch = new Brand();
  }

  loadBrand() {
    this.brandFormService.getAll().pipe(first()).subscribe(data => {
      this.brandList = data;
    });
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.brandRegister = new Brand();
    this.brandRegister.active = true;
    this.brandRegisterForm && this.brandRegisterForm.reset();
  }

  search(event) {
    if (event && event.first) {
      this.brandSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.brandSearch.first = 0;
    }

    this.brandFormService.search(this.brandSearch).pipe(first()).subscribe(data => {
      this.brandList = data;
    });
  }

  edit(event) {
    this.isEdit = true;
    this.brandFormService.getById(this.brandRegister.id).pipe(first()).subscribe(data => {
      this.brandRegister = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(brand: Brand) {
    this.confirmationService.confirm({
      message: `Deseja remover ${brand.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.brandFormService.delete(brand.id).pipe(first()).subscribe(data => {
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Removido com sucesso',
            detail: 'Registro removido com sucesso!'
          });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    let method = this.brandRegister.id ? 'update' : 'save';
    let message = this.brandRegister.id ? 'atualizado' : 'adicionado';

    if(!this.brandRegister.active){
      this.brandRegister.active = false;
    }

    this.brandFormService[method](this.brandRegister).pipe(first()).subscribe(data => {
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
