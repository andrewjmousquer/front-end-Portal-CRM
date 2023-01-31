import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import { Report } from '../../../shared/model/report.model';


@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) { }

  check() {
    return this.http.get<boolean>(`${environment.api}/protected/report/check`);
  }

  getAll() {
    return this.http.get<Report[]>(`${environment.api}/protected/report/listAll`, { responseType: 'json' });
  }

  getAllFolders() {
    return this.http.get<Report[]>(`${environment.api}/protected/report/listAllFolders`, { responseType: 'json' });
  }
}
