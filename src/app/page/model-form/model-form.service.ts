import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Model } from "src/app/shared/model/model.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ModelFormService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Model[]>(`${environment.api}/protected/model`);
  }

  search(model: Model) {
    return this.http.post<Model[]>(`${environment.api}/protected/model/find`, model);
  }

  getById(id: number) {
    return this.http.get<Model>(`${environment.api}/protected/model/${id}`);
  }

  getAllByBrand(id: number) {
    return this.http.get<Model[]>(`${environment.api}/protected/model/brand/${id}`);
  }

  update(model: Model) {
    return this.http.put<Model>(`${environment.api}/protected/model`, model);
  }

  save(model: Model) {
    return this.http.post<Model>(`${environment.api}/protected/model`, model);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/model/${id}`);
  }

}
