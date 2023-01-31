import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { ProductModel } from "../model/product-model.model";

@Injectable({ providedIn: 'root' })
export class ProductModelService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<ProductModel[]>(`${environment.api}/protected/productmodel`);
    }

    search(productModel: ProductModel) {
        return this.http.post<ProductModel[]>(`${environment.api}/protected/productmodel/find`, productModel);
    }

    getById(id: number) {
        return this.http.get<ProductModel>(`${environment.api}/protected/productmodel/${id}`);
    }

    save(productModel: ProductModel) {
        return this.http.post<ProductModel>(`${environment.api}/protected/productmodel/`, productModel);
    }

    update(productModel: ProductModel) {
        return this.http.put<ProductModel>(`${environment.api}/protected/productmodel`, productModel);
    }

    delete(id: number) {
        return this.http.delete<ProductModel>(`${environment.api}/protected/product/${id}`);
    }

}
