import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Lead } from "../model/lead.model";

@Injectable({ providedIn: 'root' })
export class LeadService {
    constructor(private http: HttpClient) { }

    getById(id: number) {
      return this.http.get<Lead>(`${environment.api}/protected/lead/${id}`);
    }

    save(lead: Lead) {
      return this.http.post<Lead>(`${environment.api}/protected/lead/`, lead);
    }

    update(lead: Lead) {
      return this.http.put<Lead>(`${environment.api}/protected/lead/`, lead);

    }

    search(leadFilter: Lead) {
      return this.http.post<Lead[]>(`${environment.api}/protected/lead/find`, leadFilter);
    }

    getAll() {
      return this.http.get<Lead[]>(`${environment.api}/protected/lead/`);
    }

    delete(id: any) {
      return this.http.delete<boolean>(`${environment.api}/protected/lead/${id}`);
    }

}
