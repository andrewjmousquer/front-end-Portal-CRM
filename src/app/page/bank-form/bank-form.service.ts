import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Bank } from "src/app/shared/model/bank.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class BankFormService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Bank[]>(`${environment.api}/protected/bank`);
  }

  search(bank: Bank) {
    return this.http.post<Bank[]>(`${environment.api}/protected/bank/find`, bank);
  }

  getById(id: number) {
    return this.http.get<Bank>(`${environment.api}/protected/bank/${id}`);
  }

  save(bank: Bank) {
    return this.http.post<Bank>(`${environment.api}/protected/bank`, bank);
  }

  update(bank: Bank) {
    return this.http.put<Bank>(`${environment.api}/protected/bank`, bank);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/bank/${id}`);
  }
}
