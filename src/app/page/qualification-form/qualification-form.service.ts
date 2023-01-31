import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Qualification } from "src/app/shared/model/qualification.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class QualificationFormService {

  constructor(private http: HttpClient) { }


  getAll() {
    return this.http.get<Qualification[]>(`${environment.api}/protected/qualification/`);
  }

  getTree() {
    return this.http.get<any>(`${environment.api}/protected/qualification/tree`);
  }

}