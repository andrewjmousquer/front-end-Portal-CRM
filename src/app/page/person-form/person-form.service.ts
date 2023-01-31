import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Person } from "src/app/shared/model/person.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class PersonFormService {

    constructor(private http: HttpClient){ }

    getAll(){
        return this.http.get<Person[]>(`${environment.api}/protected/person`)
    }

    search(person: Person){
        return this.http.post<Person[]>(`${environment.api}/protected/person/find`, person);
    }

    getById(id: number){
        return this.http.get<Person>(`${environment.api}/protected/person/${id}`);
    }

    save(person: Person){
        return this.http.post<Person>(`${environment.api}/protected/person/`, person);
    }

    update(person: Person) {
        return this.http.put<Person>(`${environment.api}/protected/person/`, person);
    }

    delete(id: number){
        return this.http.delete<boolean>(`${environment.api}/protected/person/${id}`);
    }

    findByDocument(searchText: string) {
        return this.http.post<Person>(`${environment.api}/protected/person/findByDocument`, searchText);
    }

    findByContact(person: Person) {
      return this.http.post<Person>(`${environment.api}/protected/person/findByDocument`, person);
  }
}
