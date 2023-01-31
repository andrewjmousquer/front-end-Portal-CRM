import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { SalesTeam } from '../model/sales-team.model';

@Injectable({ providedIn: 'root' })
export class SalesTeamService {

  salesTeam: SalesTeam;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<SalesTeam[]>(`${environment.api}/protected/salesteam/listAll`);
  }
}
