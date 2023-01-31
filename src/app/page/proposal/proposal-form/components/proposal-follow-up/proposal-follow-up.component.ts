import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Proposal } from 'src/app/shared/model/proposal';

import { NgForm } from "@angular/forms";

import { first } from "rxjs/operators";
import { ConfirmationService, MessageService } from "primeng/api";
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { ProposalFollowUpService } from 'src/app/shared/service/proposal-follow-up.service';
import { ProposalFollowUp } from 'src/app/shared/model/proposal-follow-up.model';
import * as _ from 'lodash';

@Component({
  selector: 'wbp-proposal-follow-up',
  templateUrl: './proposal-follow-up.component.html'
})
export class ProposalFollowUpComponent implements OnInit {

  @Input() proposal: Proposal;

  isEdit: boolean = false;
  mediaTypeList: Classifier[];
  mediaTypeSelected: Classifier;
  followUpBackup: ProposalFollowUp ;
  followUpRegister: ProposalFollowUp ;

  @Input() followUpList: ProposalFollowUp[];
  
  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('followUpRegisterForm', { static: false }) followUpRegisterForm: NgForm;
  
  constructor(
    private messageService: MessageService,
    private followUpService: ProposalFollowUpService,
    private classifierService: ClassifierService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.proposal = this.proposal || new Proposal();
    this.followUpList = new Array<ProposalFollowUp>();
   
    this.loadFupList();
    this.loadMediaType();
    this.resetRegisterForm();
  }

  ngOnChanges(): void {
   this.loadFupList();
  }

  loadFupList(){
    if (this.proposal && this.proposal.proposalFollowUp && this.proposal.proposalFollowUp.length > 0) {
      this.followUpList = this.proposal.proposalFollowUp;
    }
  }

  loadMediaType(){
    this.classifierService.searchByType(ClassifierEnum.MEDIA_CONTACT).pipe(first()).subscribe(data => {
      this.mediaTypeList = data;
    });
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.followUpBackup = null;
    this.followUpRegister = new ProposalFollowUp();
    this.followUpRegister.media = new Classifier();
    this.mediaTypeSelected = new Classifier();
    this.followUpRegisterForm && this.followUpRegisterForm.form.reset();
  }

  editFup(proposalFup) {
    this.isEdit = true;
    this.followUpBackup = _.clone(this.followUpRegister);
    let index = this.followUpList.indexOf(proposalFup.data)
    this.followUpList.splice(index, 1);

    this.followUpRegister.date = new Date(this.followUpRegister.date);
    this.mediaTypeSelected = this.followUpRegister.media;
  }

  cancel() {
    if(this.isEdit){
      this.followUpList.push(this.followUpBackup);
      this.resetRegisterForm();
    } else {
      this.followUpRegister= new ProposalFollowUp();
    }
  }

  remove() {
    this.confirmationService.confirm({
      message: `Deseja remover ${this.followUpRegister.person}?`, header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.followUpService.delete(this.followUpRegister.id).pipe(first()).subscribe(data => {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com Sucesso!', detail: 'Registro removido com sucesso!' });
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
    let method = this.followUpRegister.id ? 'update' : 'save';
    let message = this.followUpRegister.id ? 'Atualizado' : 'Adicionado';
    
    this.followUpRegister.proposal = this.proposal.id;
    this.followUpRegister.media = this.mediaTypeSelected;

    this.followUpService[method](this.followUpRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!`});
      this.followUpList.push(data);
      this.resetRegisterForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }
}
