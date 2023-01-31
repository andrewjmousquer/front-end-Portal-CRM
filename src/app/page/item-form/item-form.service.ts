import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item } from "src/app/shared/model/item.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ItemFormService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Item[]>(`${environment.api}/protected/item`);
  }

  search(item: Item) {
    return this.http.post<Item[]>(`${environment.api}/protected/item/find`, item);
  }

  getById(id: number) {
    return this.http.get<Item>(`${environment.api}/protected/item/${id}`);
  }

  save(item: Item) {
    return this.http.post<Item>(`${environment.api}/protected/item`, item);
  }

  update(item: Item) {
    return this.http.put<Item>(`${environment.api}/protected/item`, item);
  }
  
  upload(id: number, file: File, type: string) {
    const formData: FormData = new FormData;
    formData.append('file', file);
    return this.http.post<Item>(`${environment.api}/protected/item/upload/${id}/${type}`, formData);
  }

  image(name: String) {
    return this.http.get<any>(`${environment.api}/protected/item/image/${name}`);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/item/${id}`);
  }
}