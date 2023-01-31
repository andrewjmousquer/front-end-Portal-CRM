import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment'
import { Person } from '../../shared/model/person.model'

@Injectable({ providedIn: 'root' })
export class PersonService {

  person: Person;

  constructor(private http: HttpClient) { }

  getById(id: number){
    return this.http.get<Person>(`${environment.api}/protected/person/${id}`);
  }

  getAll() {
    return this.http.get<Person[]>(`${environment.api}/protected/person/listAll`);
  }

  search(searchText: string) {
    return this.http.post<Person[]>(`${environment.api}/protected/person/find`, searchText);
  }

  findByDocument(searchText: string) {
    return this.http.post<Person>(`${environment.api}/protected/person/findByDocument`, searchText);
  }

  findByContact(searchText: string) {
    return this.http.post<Person[]>(`${environment.api}/protected/person/findByContact`, searchText);
  }
}
