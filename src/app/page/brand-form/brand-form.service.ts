import { HttpClient } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Brand } from "src/app/shared/model/brand.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class BrandFormService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Brand[]>(`${environment.api}/protected/brand`);
  }

  search(brand: Brand) {
    return this.http.post<Brand[]>(`${environment.api}/protected/brand/find`, brand);
  }

  getById(id: number) {
    return this.http.get<Brand>(`${environment.api}/protected/brand/${id}`);
  }

  save(brand: Brand) {
    return this.http.post<Brand>(`${environment.api}/protected/brand`, brand);
  }

  update(brand: Brand) {
    return this.http.put<Brand>(`${environment.api}/protected/brand/`, brand);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/brand/${id}`);
  }
}
