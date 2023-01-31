import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Sale } from 'src/app/shared/model/sale.model';


@Injectable({ providedIn: 'root' })
export class HistoryService {

  sale: Sale;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Sale[]>(`${environment.api}/protected/history/list`);
  }

  search(transaction: Sale) {
    return this.http.post<Sale[]>(`${environment.api}/protected/history/search`, transaction);
  }

  getTotalRecords(transaction: Sale) {
    return this.http.post<number>(`${environment.api}/protected/history/totalRecords`, transaction);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/sale/${id}`);
  }

  exportExcel(transaction: Sale) {
    return this.http.post<any>(`${environment.api}/protected/history/exportExcel`, transaction, { responseType: 'blob' as 'json' });
  }

  exportPdf(transaction: Sale) {
    return this.http.post<any>(`${environment.api}/protected/history/exportPdf`, transaction, { responseType: 'blob' as 'json' });
  }

}
