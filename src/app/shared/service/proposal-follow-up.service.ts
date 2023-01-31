import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from 'src/environments/environment';

import { ProposalFollowUp } from "../model/proposal-follow-up.model";

@Injectable({
    providedIn: 'root'
})
export class ProposalFollowUpService {

    constructor(private http: HttpClient) {
    }

    getAll() {
      return this.http.get<ProposalFollowUp[]>(`${environment.api}/protected/followup/listAll`);
    }

    getById(id: number) {
      return this.http.get<ProposalFollowUp>(`${environment.api}/protected/followup/${id}`);
    }

    save(proposalFollowUp: ProposalFollowUp){
      return this.http.post<ProposalFollowUp>(`${environment.api}/protected/followup/`, proposalFollowUp);
    }

    update(proposalFollowUp: ProposalFollowUp) {
      return this.http.put<ProposalFollowUp>(`${environment.api}/protected/followup/`, proposalFollowUp);
    }

    delete(id: Number) {
      return this.http.delete<boolean>(`${environment.api}/protected/followup/${id}`);
    }
}