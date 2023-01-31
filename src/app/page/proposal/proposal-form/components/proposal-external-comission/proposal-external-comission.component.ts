import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Proposal } from 'src/app/shared/model/proposal';

@Component({
  selector: 'wbp-proposal-external-comission',
  templateUrl: './proposal-external-comission.component.html'
})
export class ProposalExternalComissionComponent implements OnInit {

  @Input() proposal: Proposal;
  @Output() updateRegister: EventEmitter<Proposal> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  updateRegisterComission(event) {
    this.proposal = event;
    this.updateRegister.emit(this.proposal);
  }
}
