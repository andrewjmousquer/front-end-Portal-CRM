import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


import { environment } from '../../../environments/environment';
import { Checkpoint } from '../../shared/model/checkpoint.model';

@Injectable({ providedIn: 'root' })
export class CheckpointService {

  private checkpointSource = new Subject<string>();
  private resetSource = new Subject();

  checkpointSource$ = this.checkpointSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  constructor(private http: HttpClient) { }

  getByCurrentUser() {
    return this.http.get<Checkpoint[]>(`${environment.api}/protected/checkpoint/list/currentUser`);
  }

  getAll() {
    return this.http.get<Checkpoint[]>(`${environment.api}/protected/checkpoint/listAll`);
  }

  onCheckpointStateChange(key: string) {
    this.checkpointSource.next(key);
  }


  reset() {
    this.resetSource.next();
  }
}
