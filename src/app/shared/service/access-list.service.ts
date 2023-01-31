import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AccessList } from '../../shared/model/access-list.model';

@Injectable({ providedIn: 'root' })
export class AccessListService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<AccessList[]>(`${environment.api}/protected/accessList/listAll`);
    }
}
