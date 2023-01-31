import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AddressCep } from '../model/address-cep.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
    constructor(private http: HttpClient) { }

    getByCep(cep: string) {
        return this.http.get<AddressCep>(`https://viacep.com.br/ws/${cep}/json`);
    }
}
