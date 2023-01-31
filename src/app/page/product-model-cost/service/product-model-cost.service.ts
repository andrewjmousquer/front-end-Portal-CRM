import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductModelCost } from 'src/app/shared/model/product.model.cost';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductModelCostService {

  constructor(private http: HttpClient) {
  }

  getById(id: number) {
      return this.http.get<ProductModelCost>(`${environment.api}/protected/productmodelcost/${id}`);
  }

  getAll() {
      return this.http.get<ProductModelCost[]>(`${environment.api}/protected/productmodelcost`);
  }

  find(productModelCost: ProductModelCost) {
    return this.http.post<ProductModelCost[]>(`${environment.api}/protected/productmodelcost/find`, productModelCost);
  }

  findDuplicateMultipleValidate(productModelCosts: ProductModelCost[]) {
    return this.http.post<ProductModelCost[]>(`${environment.api}/protected/productmodelcost/find/duplicatemultiple/validate`, productModelCosts);
  }

  save(productModelCost: ProductModelCost) {
      return this.http.post<ProductModelCost>(`${environment.api}/protected/productmodelcost/`, productModelCost);
  }

  saveBulk(productModelCosts: ProductModelCost[]) {
    return this.http.post<ProductModelCost>(`${environment.api}/protected/productmodelcost/bulk`, productModelCosts);
  }

  update(productModelCost: ProductModelCost) {
      return this.http.put<ProductModelCost>(`${environment.api}/protected/productmodelcost`, productModelCost);
  }

  updateBulk(productModelCosts: ProductModelCost[]) {
    return this.http.put<ProductModelCost>(`${environment.api}/protected/productmodelcost/bulk`, productModelCosts);
  }

  delete(id: number) {
      return this.http.delete<ProductModelCost>(`${environment.api}/protected/productmodelcost/${id}`);
  }
}