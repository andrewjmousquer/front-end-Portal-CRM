import { Component, Input, OnInit } from '@angular/core';
import { Proposal } from 'src/app/shared/model/proposal';

@Component({
  selector: 'wbp-proposal-internal-comission',
  templateUrl: './proposal-internal-comission.component.html'
})
export class ProposalInternalComissionComponent implements OnInit {

  @Input() proposal: Proposal;

  constructor() { }

  ngOnInit(): void {
  }

}
