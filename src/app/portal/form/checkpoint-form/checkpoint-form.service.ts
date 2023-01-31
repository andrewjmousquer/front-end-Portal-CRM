import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Checkpoint } from '../../../shared/model/checkpoint.model';

@Injectable({ providedIn: 'root' })
export class CheckpointFormService {

  checkpoint: Checkpoint;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Checkpoint[]>(`${environment.api}/protected/checkpoint/listAll`);
  }

  getById(id: number) {
    return this.http.get<Checkpoint>(`${environment.api}/protected/checkpoint/${id}`);
  }

  search(checkpoint: Checkpoint) {
    return this.http.post<Checkpoint[]>(`${environment.api}/protected/checkpoint/search`, checkpoint);
  }

  save(checkpoint: Checkpoint) {
    return this.http.post<Checkpoint>(`${environment.api}/protected/checkpoint/save`, checkpoint);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/checkpoint/${id}`);
  }
}
