import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Proposal } from '../model/proposal';
import { ProposalDTO } from '../dto/proposal/proposal.dto';
import { ProposalList } from '../model/proposal-list';
import { ProposalSearch } from '../model/proposal-search';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  constructor(private http: HttpClient) {
  }

  search(proposalSearch: ProposalSearch) {
    return this.http.post<ProposalList[]>(`${environment.api}/protected/proposal/find`, proposalSearch);
  }

  getAll() {
    return this.http.get<Proposal[]>(`${environment.api}/protected/proposal/listAll`);
  }

  getProposal(id: number) {
    return this.http.get<ProposalDTO>(`${environment.api}/protected/proposal/getProposal/${id}`);
  }
}
