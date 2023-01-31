import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { ProposalApprovalRule } from 'src/app/shared/model/proposal-approval-rule';

@Injectable({
  providedIn: 'root'
})
export class ProposalApprovalRuleFormService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<ProposalApprovalRule[]>(`${environment.api}/protected/proposalapprovalrule/listAll`);
  }

  search(proposalApprovalRule: ProposalApprovalRule) {
    return this.http.post<ProposalApprovalRule[]>(`${environment.api}/protected/proposalapprovalrule/find`, proposalApprovalRule);
  }

  getById(id: number) {
    return this.http.get<ProposalApprovalRule>(`${environment.api}/protected/proposalapprovalrule/${id}`);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/proposalapprovalrule/${id}`);
  }

  save(proposalApprovalRule: ProposalApprovalRule) {
    return this.http.post<ProposalApprovalRule>(`${environment.api}/protected/proposalapprovalrule`, proposalApprovalRule);
  }

  update(proposalApprovalRule: ProposalApprovalRule) {
    return this.http.put<ProposalApprovalRule>(`${environment.api}/protected/proposalapprovalrule`, proposalApprovalRule);
  }
}
