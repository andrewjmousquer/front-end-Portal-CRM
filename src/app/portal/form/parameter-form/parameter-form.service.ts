import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Parameter } from '../../../shared/model/parameter.model';

@Injectable({ providedIn: 'root' })
export class ParameterFormService {

  parameter: Parameter;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Parameter[]>(`${environment.api}/protected/parameter/listAll`);
  }

  getById(id: number) {
    return this.http.get<Parameter>(`${environment.api}/protected/parameter/${id}`);
  }

  search(parameter: Parameter) {
    return this.http.post<Parameter[]>(`${environment.api}/protected/parameter/search`, parameter);
  }

  save(parameter: Parameter) {
    return this.http.post<Parameter>(`${environment.api}/protected/parameter/save`, parameter);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/parameter/${id}`);
  }

  getByName(name: string){
    return this.http.get<Parameter>(`${environment.api}/protected/parameter/name/${name}`);
  }
}
