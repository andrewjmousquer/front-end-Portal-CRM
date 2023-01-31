import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Proposal } from 'src/app/shared/model/proposal';
import { ProposalResumePrintComponent } from '../proposal-resume-print/proposal-resume-print.component';
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { ProposalFormService } from '../../proposal-form.service';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'wbp-proposal-header',
  templateUrl: './proposal-header.component.html'
})
export class ProposalHeaderComponent implements OnInit {

  @Input() register: ProposalDTO;

  id: number = 0;

  constructor(
    public dialogService: DialogService,
    public proposalService: ProposalFormService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  print() {
    this.dialogService.open(ProposalResumePrintComponent, {
      data: this.register,
      header: 'Proposta - Resumo',
      showHeader: true,
      width: '210mm',
    });
  }

  downloadProposalReport() {
    this.proposalService.downloadProposalReport(this.register.proposal.proposalNumber).subscribe(data => {  
      var blob = data.body as Blob;
      FileSaver.saveAs(blob, this.register.proposal.proposalNumber + ".pdf");
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Donwload Proposta', detail: 'Download concluído com sucesso!' });
    }, error => {
        this.messageService.add({key: 'tst', severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao fazer o download da proposta!'});
    });
}

}
