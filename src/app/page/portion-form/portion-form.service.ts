import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Portion } from 'src/app/shared/model/portion.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PortionFormService {

  portion: Portion;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Portion[]>(`${environment.api}/protected/portion/listAll`);
  }

  getById(id: number) {
    return this.http.get<Portion>(`${environment.api}/protected/portion/${id}`);
  }

  search(text: string) {
    return this.http.post<Portion[]>(`${environment.api}/protected/portion/search`, text);
  }

  save(portion: Portion) {
    return this.http.post<Portion>(`${environment.api}/protected/portion/save`, portion);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/portion/${id}`);
  }
}
