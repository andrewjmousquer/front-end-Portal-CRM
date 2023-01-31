import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { QualificationTree } from "../model/qualification-tree.model";
import { Qualification } from "../model/qualification.model";

@Injectable({ providedIn: 'root' })
export class QualificationService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Qualification[]>(`${environment.api}/protected/qualification`)
  }

  tree() {
    return this.http.get<QualificationTree>(`${environment.api}/protected/qualification/tree`);
  }

  getById(id: number) {
    return this.http.get<Qualification>(`${environment.api}/protected/qualification/${id}`);
  }

  search(qualification: Qualification) {
    return this.http.post<Qualification[]>(`${environment.api}protected/qualification/find`, qualification);
  }

  update(qualification: Qualification) {
    return this.http.put<Qualification>(`${environment.api}/protected/qualification`, qualification);
  }

  save(qualification: Qualification) {
    return this.http.post<Qualification>(`${environment.api}/protected/qualification`, qualification);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/qualification/${id}`);
  }
}
