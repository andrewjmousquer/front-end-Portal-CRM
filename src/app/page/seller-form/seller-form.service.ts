import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Seller } from "src/app/shared/model/seller.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class SellerFormService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Seller[]>(`${environment.api}/protected/seller/listAll`);
  }

  search(text: string) {
    return this.http.post<Seller[]>(`${environment.api}/protected/seller/find`, text);
  }

  getById(id: number) {
    return this.http.get<Seller>(`${environment.api}/protected/seller/${id}`);
  }

  save(seller: Seller) {
    return this.http.post<Seller>(`${environment.api}/protected/seller/`, seller);
  }

  update(seller: Seller) {
    return this.http.put<Seller>(`${environment.api}/protected/seller/`, seller);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/seller/${id}`);
  }
}
