import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemType } from '../model/itemtype.model';
import { environment } from '../../../environments/environment';
import { Source } from '../model/source.model';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Source[]>(`${environment.api}/protected/source`);
  }

  search(source: Source) {
    return this.http.post<Source[]>(`${environment.api}/protected/source/find`, source);
  }

  getById(id: number) {
    return this.http.get<Source>(`${environment.api}/protected/source/${id}`);
  }

  save(source: Source) {
    return this.http.post<Source>(`${environment.api}/protected/source/`, source);
  }

  update(source: Source) {
    return this.http.put<Source>(`${environment.api}/protected/source`, source);
  }

  delete(id: number) {
    return this.http.delete<Source>(`${environment.api}/protected/source/${id}`);
  }
}
