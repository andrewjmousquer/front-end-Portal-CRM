import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { SellerAgent } from "../model/seller-agent.model";

@Injectable({ providedIn: 'root' })
export class SellerAgentService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<SellerAgent[]>(`${environment.api}/protected/selleragent/listAll`);
  }
}
