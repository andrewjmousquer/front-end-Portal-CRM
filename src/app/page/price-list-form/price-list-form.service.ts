import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PriceList } from 'src/app/shared/model/price-list-model';
import { environment } from "src/environments/environment";
import { PriceListDuplicateItem } from './dtos/price-list-duplicate-item.model';
import { PriceListFormSearch } from './dtos/price-list-form-search.model';
import { PriceListForm } from './dtos/price-list-form.model';

@Injectable({
  providedIn: 'root'
})
export class PriceListFormService {

  constructor(private http: HttpClient) { }

  search( priceList:PriceList ) {
    return this.http.post<PriceListFormSearch[]>( `${environment.api}/protected/pricelistform/search`, priceList );
  }

  getById( id: number ) {
    return this.http.get<PriceListForm>(`${environment.api}/protected/pricelistform/${id}`);
  }

  save(priceListForm: PriceListForm) {
    return this.http.post<PriceListForm>(`${environment.api}/protected/pricelistform/`, priceListForm);
  }
  
  update(priceListForm: PriceListForm) {
    return this.http.put<PriceListForm>(`${environment.api}/protected/pricelistform/`, priceListForm);
  }

  delete(id: number) {
    return this.http.delete(`${environment.api}/protected/pricelistform/${id}`);
  }

  checkDuplicateItens( priceListForm: PriceListForm ) {
    return this.http.post<PriceListDuplicateItem[]>(`${environment.api}/protected/pricelistform/checkDuplicateItens`, priceListForm);
  }

}
