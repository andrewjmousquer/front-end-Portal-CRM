import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/model/product.model';
import { Parameter } from '../../shared/model/parameter.model';
import { ProductModel } from 'src/app/shared/model/product-model.model';

@Injectable({
    providedIn: 'root'
})
export class ProductFormService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Product[]>(`${environment.api}/protected/product`);
    }

    search(product: Product) {
        return this.http.post<Product[]>(`${environment.api}/protected/product/find`, product);
    }

    getById(id: number) {
        return this.http.get<Product>(`${environment.api}/protected/product/${id}`);
    }

    save(product: Product) {
        return this.http.post<Product>(`${environment.api}/protected/product/`, product);
    }

    update(product: Product) {
        return this.http.put<Product>(`${environment.api}/protected/product`, product);
    }

    delete(id: number) {
        return this.http.delete<Product>(`${environment.api}/protected/product/${id}`);
    }
}
