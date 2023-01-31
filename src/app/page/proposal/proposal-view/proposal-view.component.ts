import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { ProposalService } from 'src/app/shared/service/proposal.service';
import { Utils } from 'src/app/shared/util/util';
import { Vehicle } from 'src/app/shared/model/vehicle.model';
import { Model } from 'src/app/shared/model/model.model';
import { Brand } from 'src/app/shared/model/brand.model';
import { MessageService } from 'primeng/api';
import { Proposal } from 'src/app/shared/model/proposal';

@Component({
  selector: 'portal-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.css']
})
export class ProposalViewComponent implements OnInit {

  proposal: ProposalDTO;

  constructor(private ref: DynamicDialogRef, 
              private config: DynamicDialogConfig,
              private proposalService: ProposalService,
              private messageService: MessageService
              ) { }

  ngOnInit(): void {

    this.proposal = new ProposalDTO();
    this.proposal.proposal = new Proposal();
   
      this.proposalService.getProposal(this.config.data.proposal.id).pipe(first()).subscribe(data => {
        if (data.proposal.proposalDetailVehicle.vehicle && data.proposal.proposalDetailVehicle.vehicle.purchaseDate) {
          data.proposal.proposalDetailVehicle.vehicle.purchaseDate = Utils.normalizeDate(data.proposal.proposalDetailVehicle.vehicle.purchaseDate);
        } else if (!data.proposal.proposalDetailVehicle.vehicle) {
          data.proposal.proposalDetailVehicle.vehicle = new Vehicle();
          data.proposal.proposalDetailVehicle.vehicle.model = new Model;
          data.proposal.proposalDetailVehicle.vehicle.model.brand = new Brand;
          data.proposal.proposalDetailVehicle.futureDelivery = true;
        }
  
        this.proposal = data;
        this.proposal.proposal.proposalPayment.map(payment => {
          payment.showPaymentPreApproved = true;
          payment.dueDate = Utils.normalizeDate(payment.dueDate);
          payment.paymentPercent = _.round(payment.paymentAmount / data.proposal.proposalDetailVehicle.totalAmount * 100, 2);
        });
  
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    

    
  }

}
