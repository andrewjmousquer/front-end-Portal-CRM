import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemType } from '../../shared/model/itemtype.model';
import { NgForm } from '@angular/forms';
import { ItemTypeService } from '../../shared/service/item-type.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-item-type-form',
  templateUrl: './item-type-form.component.html',
})
export class ItemTypeFormComponent implements OnInit {
  isEdit: boolean = false;

  cols: any[];
  itemTypeSearch: ItemType;
  itemTypeRegister: ItemType;
  itemTypeList: ItemType[];

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('itemTypeRegisterForm', { static: false }) itemTypeRegisterForm: NgForm;

  constructor(private itemTypeService: ItemTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'mandatory', header: 'Obrigatório' },
      { field: 'multi', header: 'Permite Múltiplos' },
      { field: 'seq', header: 'Ordem', class: 'justify-content-center' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadTypeItem() {
    this.itemTypeService.getAll().subscribe(data => {
      if (data != null) {
        this.itemTypeList = data;
        this.itemTypeRegister.seq = Math.max.apply(Math, this.itemTypeList.map(o => o.seq)) + 1;
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  search(event) {
    if (event && event.first) {
      this.itemTypeSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.itemTypeSearch.first = 0;
    }

    this.itemTypeService.search(this.itemTypeSearch).subscribe(data => {
      if (data != null) {
        this.itemTypeList = data;
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadTypeItem();
    this.itemTypeSearch = new ItemType();
  }

  resetRegisterForm() {
    this.itemTypeRegister = new ItemType();
    if (this.itemTypeList != null) {
      this.itemTypeRegister.seq = Math.max.apply(Math, this.itemTypeList.map(o => o.seq)) + 1;
    }
    this.itemTypeRegister.multi = true;
    this.itemTypeRegister.mandatory = true;
    this.itemTypeRegisterForm && this.itemTypeRegisterForm.reset();
  }

  edit(event) {
    this.itemTypeService.getById(this.itemTypeRegister.id).pipe(first()).subscribe(data => {
      this.itemTypeRegister = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  save() {
    this.isEdit = true;
    let method = this.itemTypeRegister.id ? 'update' : 'save';
    let message = this.itemTypeRegister.id ? 'atualizado' : 'adicionado';

    this.itemTypeService[method](this.itemTypeRegister).pipe(first()).subscribe(data => {
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

  remove() {
    this.confirmationService.confirm({
      message: `Deseja remover ${this.itemTypeRegister.name}?`, header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.itemTypeService.delete(this.itemTypeRegister.id).pipe(first()).subscribe(data => {
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
}
