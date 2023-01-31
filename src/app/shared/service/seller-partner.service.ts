import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { SellerPartner } from "../model/seller-partner.model";

@Injectable({ providedIn: 'root' })
export class SellerPartnerService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<SellerPartner[]>(`${environment.api}/protected/sellerpartner/listAll`);
  }
}
