import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Parameter } from '../../shared/model/parameter.model';

@Injectable({ providedIn: 'root' })
export class ParameterService {
  constructor(private http: HttpClient) { }

  search(classifier: Parameter) {
    return this.http.post<Parameter[]>(`${environment.api}/protected/parameter/search`, Parameter);
  }

  searchByName(name: string) {
    const parameter = new Parameter();
    parameter.name = name;
    return this.http.post<Parameter[]>(`${environment.api}/protected/parameter/search/`, parameter);
  }
}
