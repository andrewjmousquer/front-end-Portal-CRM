import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Classifier } from '../../shared/model/classifier.model';

@Injectable({ providedIn: 'root' })
export class ClassifierService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Classifier[]>(`${environment.api}/protected/classifier/listAll`);
  }

  search(classifier: Classifier) {
    return this.http.post<Classifier[]>(`${environment.api}/protected/classifier/search`, classifier);
  }

  searchByType(type: string) {
    return this.http.get<Classifier[]>(`${environment.api}/protected/classifier/searchByType/${type}`);
  }

  searchByValue(value: string) {
    return this.http.get<Classifier>(`${environment.api}/protected/classifier/searchByValue/${value}`);
  }
}
