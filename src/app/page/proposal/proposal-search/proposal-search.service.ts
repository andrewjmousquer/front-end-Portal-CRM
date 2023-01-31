import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ProposalList } from 'src/app/shared/model/proposal-list';
import { ProposalSearch } from 'src/app/shared/model/proposal-search';
import { Seller } from 'src/app/shared/model/seller.model';
import { Partner } from 'src/app/shared/model/partner.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalSearchService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<ProposalList[]>(`${environment.api}/protected/proposal/listFront`);
  }

  search(proposalSearch: ProposalSearch) {
    return this.http.post<ProposalList[]>(`${environment.api}/protected/proposal/find`, proposalSearch);
  }

  getExecutiveList() {
    return this.http.get<Seller[]>(`${environment.api}/protected/proposal/listExecutive`);
  }

  getParnerList() {
    return this.http.get<Partner[]>(`${environment.api}/protected/proposal/listPartner`);
  }
}
