import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product.model';
import { environment } from '../../../environments/environment';
import { ItemType } from '../model/itemtype.model';

@Injectable({
  providedIn: 'root'
})
export class ItemTypeService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<ItemType[]>(`${environment.api}/protected/itemtype`);
  }

  search(itemType: ItemType) {
    return this.http.post<ItemType[]>(`${environment.api}/protected/itemtype/find`, itemType);
  }

  getById(id: number) {
    return this.http.get<ItemType>(`${environment.api}/protected/itemtype/${id}`);
  }

  save(itemType: ItemType) {
    return this.http.post<ItemType>(`${environment.api}/protected/itemtype/`, itemType);
  }

  update(itemType: ItemType) {
    return this.http.put<ItemType>(`${environment.api}/protected/itemtype`, itemType);
  }

  delete(id: number) {
    return this.http.delete<ItemType>(`${environment.api}/protected/itemtype/${id}`);
  }
}
