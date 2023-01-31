import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LeadFup } from "../model/lead-fup.model";
import { environment } from "src/environments/environment";
import { Lead } from "../model/lead.model";

@Injectable({ providedIn: 'root' })
export class LeadFupService {
    constructor(private http: HttpClient) { }

    save(leadFup: LeadFup) {
      return this.http.post<LeadFup>(`${environment.api}/protected/leadfup`, leadFup);
    }

    update(leadFup: LeadFup) {
      return this.http.put<LeadFup>(`${environment.api}/protected/leadfup`, leadFup);
    }

    delete(id: any) {
      return this.http.delete<boolean>(`${environment.api}/protected/leadfup/${id}`);
    }

    listByLead(lead: Lead) {
      return this.http.get<LeadFup[]>(`${environment.api}/protected/leadfup?leadId=` + lead.id);
    }
}
