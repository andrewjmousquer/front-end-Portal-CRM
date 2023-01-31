import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Partner } from "src/app/shared/model/partner.model";
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PartnerFormService {

  partner: Partner;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Partner[]>(`${environment.api}/protected/partner/listAll`);
  }

  search(text: string){
    return this.http.post<Partner[]>(`${environment.api}/protected/partner/find`, text);
  }

  getById(id: number) {
    return this.http.get<Partner>(`${environment.api}/protected/partner/${id}`);
  }
  save(partner: Partner) {
    return this.http.post<Partner>(`${environment.api}/protected/partner/`, partner);
  }

  update(partner: Partner) {
    return this.http.put<Partner>(`${environment.api}/protected/partner/`, partner);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/partner/${id}`);
  }


}