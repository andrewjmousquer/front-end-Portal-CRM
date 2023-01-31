import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SalesTeam } from 'src/app/shared/model/salesteam.model';

@Injectable({
  providedIn: 'root'
})
export class SalesTeamFormService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<SalesTeam[]>(`${environment.api}/protected/salesteam/listAll`);
  }

  search(model: SalesTeam) {
    return this.http.post<SalesTeam[]>(`${environment.api}/protected/salesteam/find`, model);
  }

  find(model: SalesTeam) {
    return this.http.post<SalesTeam[]>(`${environment.api}/protected/salesteam/find`, model);
  }

  getById(id: number) {
    return this.http.get<SalesTeam>(`${environment.api}/protected/salesteam/${id}`);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/salesteam/${id}`);
  }

  save(model: SalesTeam) {
    return this.http.post<SalesTeam>(`${environment.api}/protected/salesteam/`, model);
  }

  update(model: SalesTeam) {
    return this.http.put<SalesTeam>(`${environment.api}/protected/salesteam/`, model);
  }
}
