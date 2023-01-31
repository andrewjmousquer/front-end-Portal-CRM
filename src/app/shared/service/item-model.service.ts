import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { ItemModel } from "../model/item-model.model";

@Injectable({ providedIn: 'root' })
export class ItemModelService {

    constructor(private http: HttpClient) {
    }

    search(ItemModel: ItemModel) {
        return this.http.post<ItemModel[]>(`${environment.api}/protected/itemmodel/find`, ItemModel);
    }
}
