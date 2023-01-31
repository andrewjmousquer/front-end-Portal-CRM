import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as _ from "lodash";

import { AccessListFormService } from './access-list-form.service';
import { MenuService } from '../../../shared/service/menu.service';

import { CheckpointService } from '../../../shared/service/checkpoint.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';

import { AccessList } from '../../../shared/model/access-list.model';
import { Menu } from '../../../shared/model/menu.model';
import { Checkpoint } from '../../../shared/model/checkpoint.model';
import { Classifier } from '../../../shared/model/classifier.model';

@Component({
  selector: 'wbp-access-list-form',
  templateUrl: './access-list-form.component.html'
})
export class AccessListFormComponent implements OnInit {
  loading = false;
  isEdit = false;

  checkpointTypeList: Classifier[];
  accessListAvailableList: AccessList[];
  accessListSelectedList: AccessList[];
  accessListList: AccessList[];
  menuList: Menu[];
  menuAvailableList: Menu[];
  menuSelectedList: Menu[];
  checkpointAvailableList: Checkpoint[];
  checkpointSelectedList: Checkpoint[];
  checkpointList: Checkpoint[];
  items: MenuItem[];
  cols: any[];

  home: MenuItem;
  accessListSearch: AccessList;
  accessListRegister: AccessList;

  @ViewChild('accessListRegisterForm', { static: false }) accessListRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private accessListFormService: AccessListFormService,
    private menuService: MenuService,
    private checkpointService: CheckpointService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();

    this.checkpointService.getAll().pipe(first()).subscribe(data => {
      this.checkpointList = data;
      this.checkpointAvailableList = _.clone(this.checkpointList);
    });

    this.menuService.getAll().pipe(first()).subscribe(data => {
      this.menuList = data;
      this.menuAvailableList = _.clone(this.menuList);
    });
  }

  loadAccessLists() {
    this.accessListFormService.getAll().pipe(first()).subscribe(data => {
      this.accessListList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.loadAccessLists();
    this.accessListSearch = new AccessList();
  }

  search(event) {
    if (event && event.first) {
      this.accessListSearch.first = event.first;
    } else {
      if (this.dt) this.dt._first = 0;
      this.accessListSearch.first = 0;
    }
    this.accessListFormService.search(this.accessListSearch).pipe(first()).subscribe(data => {
      this.accessListList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {

    let accessList = event.data;
    this.resetRegisterForm();
    this.isEdit = true;

    this.accessListFormService.getById(accessList.id).pipe(first()).subscribe(data => {
      this.accessListRegister = data;
      
      if (this.accessListRegister.menus) {
        this.menuAvailableList = [];

        if(this.accessListRegister.menus && this.accessListRegister.menus.length > 0){
          this.accessListRegister.menus.forEach(menu => {
            this.menuSelectedList.push(menu);
            if(menu.submenus && menu.submenus.length > 0){
              menu.submenus.forEach(submenu => {
                this.menuSelectedList.push(submenu);
              });
            }
          });
        }

        this.menuList.forEach(itemBD => {
          let insertItem: boolean = true;
          this.menuSelectedList.forEach(itemView => {
            if (insertItem == true) {
              if (itemBD.id == itemView.id) {
                insertItem = false;
              }
            }
          });

          if (insertItem == true) {
            this.menuAvailableList.push(itemBD);
          }
        });
      } else {
        this.menuAvailableList = this.menuList;
      }

      if (this.accessListRegister.checkpoints) {
        this.checkpointAvailableList = [];
        this.checkpointSelectedList = this.accessListRegister.checkpoints;

        this.checkpointList.forEach(itemBD => {
          let insertItem: boolean = true;
          this.checkpointSelectedList.forEach(itemView => {
            if (insertItem == true) {
              if (itemBD.id == itemView.id) {
                insertItem = false;
              }
            }
          })

          if (insertItem == true) {
            this.checkpointAvailableList.push(itemBD);
          }
        });
      } else {
        this.checkpointAvailableList = this.checkpointList;
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  verifyInsert(list: any[], value: any){
    let insert: boolean = true;
    if(list && list.length > 0){
      list.forEach( item => {
        if(item.id == value.id){
          insert = false;
        }
      });
    }

    return insert;

  }


  remove(accessList: AccessList) {
    this.confirmationService.confirm({
      message: `Deseja remover ${accessList.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.accessListFormService.delete(accessList.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
          this.accessListRegisterForm.reset();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    if (this.menuSelectedList.length > 0) {
      this.accessListRegister.menus = this.menuSelectedList;
    }

    if (this.checkpointSelectedList.length > 0) {
      this.accessListRegister.checkpoints = this.checkpointSelectedList;
    }

    this.accessListFormService.save(this.accessListRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
      this.accessListRegisterForm.reset();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.accessListRegister = new AccessList();
    this.checkpointAvailableList = _.clone(this.checkpointList);
    this.checkpointSelectedList = [];
    this.menuAvailableList = this.menuList;
    this.menuSelectedList = [];
    this.isEdit = false;
  }

}
