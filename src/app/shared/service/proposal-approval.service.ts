import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProposalApproval } from '../model/proposal-approval';
import { ProposalApprovalList } from '../model/proposal-approval-list';
import { ProposalApprovalFilter } from '../model/proposal-approval-filter';
import { ProposalApprovalDetail } from '../model/proposal-approval-detail';

@Injectable({
    providedIn: 'root'
})
export class ProposalApprovalService {

    constructor(private http: HttpClient) {
    }

    find(filter: ProposalApprovalFilter){
        return this.http.post<ProposalApprovalList[]>(`${environment.api}/protected/proposalapproval/find`, filter);
    }

    getAll() {
        return this.http.get<ProposalApprovalList[]>(`${environment.api}/protected/proposalapproval/listAll`);
    }

    getById(id: number) {
      return this.http.get<ProposalApprovalDetail>(`${environment.api}/protected/proposalapproval/${id}`);
    }

    save(proposalApproval: ProposalApproval){
        return this.http.post<ProposalApproval>(`${environment.api}/protected/proposalapproval/`, proposalApproval);
    }
}
