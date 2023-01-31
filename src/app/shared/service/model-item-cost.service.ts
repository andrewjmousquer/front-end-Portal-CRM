import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModelItemCost } from "../model/model-item-cost.model";

@Injectable({ providedIn: 'root' })
export class ModelItemCostService {
    constructor(private http: HttpClient) { }

    getById(id: number) {
      return this.http.get<ModelItemCost>(`${environment.api}/protected/modelItemCost/${id}`);
    }

    save(modelItemCost: ModelItemCost) {
      return this.http.post<ModelItemCost>(`${environment.api}/protected/modelItemCost/`, modelItemCost);
    }

    update(modelItemCost: ModelItemCost) {
      return this.http.put<ModelItemCost>(`${environment.api}/protected/modelItemCost/`, modelItemCost);

    }

    search(modelItemCostFilter: ModelItemCost) {
      return this.http.post<ModelItemCost[]>(`${environment.api}/protected/modelItemCost/find`, modelItemCostFilter);
    }

    getAll() {
      return this.http.get<ModelItemCost[]>(`${environment.api}/protected/modelItemCost/`);
    }

    delete(id: any) {
      return this.http.delete<boolean>(`${environment.api}/protected/modelItemCost/${id}`);
    }

    validateList(modelItemCostList: ModelItemCost[]) {
      return this.http.post<ModelItemCost[]>(`${environment.api}/protected/modelItemCost/validateList`, modelItemCostList);
    }

    saveList(modelItemCostList: ModelItemCost[]) {
      return this.http.post<ModelItemCost[]>(`${environment.api}/protected/modelItemCost/saveList`, modelItemCostList);
    }

    updateList(modelItemCostList: ModelItemCost[]) {
      return this.http.put<ModelItemCost[]>(`${environment.api}/protected/modelItemCost/updateList`, modelItemCostList);
    }

}
