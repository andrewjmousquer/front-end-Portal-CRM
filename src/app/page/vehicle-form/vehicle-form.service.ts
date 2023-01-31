import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Vehicle } from "src/app/shared/model/vehicle.model";
import { environment } from "src/environments/environment";



@Injectable({ providedIn: 'root' })
export class VehicleService {

  constructor(private http: HttpClient) { }


  getById(id: number) {
    return this.http.get<Vehicle>(`${environment.api}/protected/vehicle/${id}`);
  }

  getByChassi(chassi: string){
    return this.http.get<Vehicle>(`${environment.api}/protected/vehicle/chassi/${chassi}`);
  }

  getByBrand(brand: string) {
    return this.http.get<Vehicle[]>(`${environment.api}/protected/vehicle/getByBrand/${brand}`);
  }

  getAll() {
    return this.http.get<Vehicle[]>(`${environment.api}/protected/vehicle/listAll`);
  }

  save(vehicle: Vehicle) {
    return this.http.post<Vehicle>(`${environment.api}/protected/vehicle/`, vehicle);
  }

  update(vehicle: Vehicle) {
    return this.http.put<Vehicle>(`${environment.api}/protected/vehicle/`, vehicle);

  }

  search(text: string) {
    return this.http.post<Vehicle[]>(`${environment.api}/protected/vehicle/find`, text);
  }

  delete(id: any) {
    return this.http.delete<boolean>(`${environment.api}/protected/vehicle/${id}`);
  }

}
