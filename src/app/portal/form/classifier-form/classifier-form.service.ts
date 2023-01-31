import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Classifier } from '../../../shared/model/classifier.model';

@Injectable({ providedIn: 'root' })
export class ClassifierFormService {

  classifier: Classifier;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Classifier[]>(`${environment.api}/protected/classifier/listAll`);
  }

  getById(id: number) {
    return this.http.get<Classifier>(`${environment.api}/protected/classifier/${id}`);
  }

  search(classifier: Classifier) {
    return this.http.post<Classifier[]>(`${environment.api}/protected/classifier/search`, classifier);
  }

  save(classifier: Classifier) {
    return this.http.post<Classifier>(`${environment.api}/protected/classifier/save`, classifier);
  }

  searchByType(type: string) {
    return this.http.get<Classifier[]>(`${environment.api}/protected/classifier/searchByType/${type}`);
  }

  searchByNameOrType(classifier: Classifier) {
    return this.http.post<Classifier[]>(`${environment.api}/protected/classifier/searchByNameOrType/`, classifier);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/classifier/${id}`);
  }
}
