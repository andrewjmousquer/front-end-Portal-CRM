import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Seller } from '../model/seller.model';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Seller[]>(`${environment.api}/protected/seller/listAll`);
  }
}
