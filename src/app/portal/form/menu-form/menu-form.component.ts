import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { first } from 'rxjs/operators';

import { Utils } from '../../../shared/util/util';

import { MenuFormService } from './menu-form.service';
import { ClassifierService } from '../../../shared/service/classifier.service';

import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';

import { Menu } from '../../../shared/model/menu.model';
import { Classifier } from 'src/app/shared/model/classifier.model';

@Component({
  selector: 'wbp-menu-form',
  templateUrl: './menu-form.component.html'
})
export class MenuFormComponent implements OnInit {
  loading = false;
  isEdit: boolean = false;
  isProduct: boolean = false;

  menuList: Menu[];
  menuRootList: Menu[];
  menuTypeList: Classifier[];
  items: MenuItem[];
  cols: any[];

  home: MenuItem;
  menuRoot: Menu;
  menuSearch: Menu;
  menuRegister: Menu;

  util: Utils = new Utils();

  @ViewChild('menuRegisterForm', { static: false }) menuRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private menuFormService: MenuFormService,
    private classifierService: ClassifierService) { }

  ngOnInit() {

    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'type.value', header: 'Tipo'},
      { field: 'route', header: 'Caminho' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadMenus() {
    this.menuFormService.getAll().pipe(first()).subscribe(data => {
      this.menuList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.menuFormService.getRoots().pipe(first()).subscribe(data => {
      this.menuRootList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.classifierService.searchByType("MENU_TYPE").pipe(first()).subscribe(data => {
      this.menuTypeList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadMenus();
    this.menuSearch = new Menu();
  }

  search(event) {
    if (event && event.first) {
      this.menuSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.menuSearch.first = 0;
    }

    this.menuFormService.search(this.menuSearch).pipe(first()).subscribe(data => {
      this.menuList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    let menu = event.data;
    this.resetRegisterForm();
    this.isEdit = true;

    this.menuFormService.getById(menu.id).pipe(first()).subscribe(data => {
      this.menuRegister = data;
      this.onChangeMenuType(this.menuRegister.type);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(menu: Menu) {
    this.confirmationService.confirm({
      message: `Deseja remover ${menu.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {

        this.menuFormService.delete(menu.id).pipe(first()).subscribe(data => {
          if (data) {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
            this.resetSearchForm();
            this.resetRegisterForm();
          }
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    this.menuFormService.save(this.menuRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.menuRegister = new Menu();
    this.menuRegister.root = new Menu();
    this.isEdit = false;
    this.isProduct = false;
    this.menuRegisterForm.reset();
  }

  onChangeMenuType(type: Classifier) {
    if (type) {
      if (type.value == "PORTAL_PRODUCT") {
        this.isProduct = true;
      } else {
        this.isProduct = false;
      }
    }
  }
}
