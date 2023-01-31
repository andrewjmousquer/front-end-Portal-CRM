import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import * as _ from "lodash";

import { SellerService } from 'src/app/shared/service/seller.service';
import { SalesTeamFormService } from './salesteam-form.service';

import { SalesTeam } from 'src/app/shared/model/salesteam.model';
import { Seller } from 'src/app/shared/model/seller.model';

@Component({
  selector: 'app-sale-form',
  templateUrl: './salesteam-form.component.html',
})

export class SaleTeamFormComponent implements OnInit {

  loading = false;
  isEdit = false;

  sellerAvailableList: Seller[];
  sellerSelectedList: Seller[];
  sellerList: Seller[];

  modelList: SalesTeam[];
  modelSearch: SalesTeam;
  modelRegister: SalesTeam;

  cols: any[];

  @ViewChild('registerForm', { static: false }) registerForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private salesTeamService: SalesTeamFormService,
    private sellerService: SellerService) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' }
    ];

    this.resetSearchForm();
    this.resetRegisterForm();
    this.listSellers();
  }

  listSalesTeams() {
    this.salesTeamService.getAll().pipe(first()).subscribe(data => {
      this.modelList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  listSellers() {
    this.sellerService.getAll().pipe(first()).subscribe(data => {
      this.sellerList = data;
      this.sellerAvailableList = _.clone(this.sellerList);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetSearchForm() {
    this.listSalesTeams();
    this.modelSearch = new SalesTeam();
  }

  search(event) {
    if (event && event.first) {
      this.modelSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.modelSearch.first = 0;
    }
    if( this.modelSearch.name ) {
      this.salesTeamService.search(this.modelSearch).pipe(first()).subscribe(data => {
        this.modelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    } else {
      this.salesTeamService.getAll().pipe(first()).subscribe(data => {
        this.modelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  edit(event) {
    this.isEdit = true;
    this.salesTeamService.getById(this.modelRegister.id).pipe(first()).subscribe(data => {
      this.modelRegister = data;

      if (this.modelRegister.sellerList && this.modelRegister.sellerList.length > 0) {
        this.sellerAvailableList = [];
        this.sellerSelectedList = this.modelRegister.sellerList;

        this.sellerList.forEach(itemBD => {
          let insertItem: boolean = true;
          this.sellerSelectedList.forEach(itemView => {
            if (insertItem == true) {
              if (itemBD.id == itemView.id) {
                insertItem = false;
              }
            }
          })

          if (insertItem == true) {
            this.sellerAvailableList.push(itemBD);
          }
        });
      } else {
        this.sellerAvailableList = _.clone(this.sellerList);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }


  remove(model: SalesTeam) {
    this.confirmationService.confirm({
      message: `Deseja remover ${model.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.salesTeamService.delete(model.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
          this.registerForm.reset();
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    });
  }

  save() {
    let method = this.modelRegister.id ? 'update' : 'save';
    let message = this.modelRegister.id ? 'atualizado' : 'adicionado';

    if(this.sellerSelectedList != null && this.sellerSelectedList.length > 0){
      this.modelRegister.sellerList = this.sellerSelectedList;
    }

    this.salesTeamService[method](this.modelRegister).pipe(first()).subscribe(data => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Salvo com sucesso',
        detail: `Registro ${message} com sucesso!`
      });
      this.resetRegisterForm();
      this.resetSearchForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.modelRegister = new SalesTeam();
    this.sellerAvailableList = _.clone(this.sellerList);
    this.sellerSelectedList = [];
    this.isEdit = false;
    this.registerForm && this.registerForm.reset();
   }
 }
