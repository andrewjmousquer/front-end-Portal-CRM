import { NgForm } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";

import { first } from "rxjs/operators";

import { ConfirmationService, MessageService } from "primeng/api";

import { ChannelFormService } from "./channel-form.service";
import { Channel } from "src/app/shared/model/channel-model";
import { Status } from "src/app/shared/model/status.model";
import { StatusDictionary } from "src/app/shared/dictionary/status.dictionary";

@Component({
  selector: 'app-channel-form',
  templateUrl: './channel-form.component.html'
})
export class ChannelFormComponent implements OnInit {

  isEdit: boolean = false;

  cols: any[];

  channelList: Channel[];
  channelSearch: Channel;
  channelRegister: Channel;

  statusList: Status[];
  selectedStatus: Status;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('channelRegisterForm', { static: false }) channelRegisterForm: NgForm;

  constructor(private messageService: MessageService,
              private channelFormService: ChannelFormService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {

    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'active', header: 'Situação' }
    ];

    this.statusList = StatusDictionary;

    this.channelRegister = new Channel();
    this.channelList = new Array<Channel>();

    this.resetSearchForm();
    this.resetRegisterForm();
  }

  loadChannel() {
    this.channelFormService.getAll().pipe(first()).subscribe(data => {
      this.channelList = data;
    });
  }

  resetSearchForm() {
    this.loadChannel();
    this.channelSearch = new Channel();
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.channelRegister = new Channel();
    
    this.channelRegisterForm && this.channelRegisterForm.form.reset({
      active: true
    });
    
    this.selectedStatus = StatusDictionary[0];
  }

  search(event) {
    if (event && event.first) {
      this.channelSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.channelSearch.first = 0;
    }

    let method = this.channelSearch.name ? 'search' : 'getAll';
    if (method === 'getAll') {
      this.loadChannel();
    } else {
      this.channelFormService[method](this.channelSearch).pipe(first()).subscribe(data => {
        this.channelList = data;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  edit(event) {
    this.isEdit = true;
    this.channelFormService.getById(this.channelRegister.id).pipe(first()).subscribe(data => {
      this.channelRegister = data;
      this.selectedStatus = this.statusList.filter(item => item.code == this.channelRegister.active)[0];
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  cancel() {
    this.channelRegister = new Channel();
  }

  remove(channel: Channel) {
    this.confirmationService.confirm({
      message: `Deseja remover ${channel.name}?`, header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.channelFormService.delete(channel.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com Sucesso!', detail: 'Registro removido com sucesso!' });
          this.resetSearchForm();
          this.resetRegisterForm();
        }, error => {
          this.messageService.add({
            key: 'tst', severity: 'error', summary: 'Erro',
            detail: error
          });
        });
      }
    })
  }

  save() {
    let method = this.channelRegister.id ? 'update' : 'save';
    let message = this.channelRegister.id ? 'atualizado' : 'adicionado';

    this.channelRegister.active = this.selectedStatus.code;
    
    if (!this.channelRegister.hasPartner)
      this.channelRegister.hasPartner = false;

    if (!this.channelRegister.hasInternalSale)
      this.channelRegister.hasInternalSale = false;

    this.channelFormService[method](this.channelRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });
      this.resetSearchForm();
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }
}
