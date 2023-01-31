import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PartnerGroup } from '../../shared/model/partner-group.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerGroupFormService {

  partner: PartnerGroup;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<PartnerGroup[]>(`${environment.api}/protected/partnergroup`);
  }

  search(partner: PartnerGroup) {
    return this.http.post<PartnerGroup[]>(`${environment.api}/protected/partnergroup/find`, partner);
  }

  find(partner: PartnerGroup) {
    return this.http.post<PartnerGroup[]>(`${environment.api}/protected/partnergroup/find?like=false`, partner);
  }

  getById(id: number) {
    return this.http.get<PartnerGroup>(`${environment.api}/protected/partnergroup/${id}`);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/partnergroup/${id}`);
  }

  save(partner: PartnerGroup) {
    return this.http.post<PartnerGroup>(`${environment.api}/protected/partnergroup/`, partner);
  }

  update(partner: PartnerGroup) {
    return this.http.put<PartnerGroup>(`${environment.api}/protected/partnergroup/`, partner);
  }
}
