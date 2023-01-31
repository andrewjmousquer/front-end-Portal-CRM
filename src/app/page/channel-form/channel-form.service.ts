import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Channel } from "src/app/shared/model/channel-model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ChannelFormService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Channel[]>(`${environment.api}/protected/channel`)
  }

  search(channel: Channel) {
    return this.http.post<Channel[]>(`${environment.api}/protected/channel/find`, channel);
  }

  getById(id: number) {
    return this.http.get<Channel>(`${environment.api}/protected/channel/${id}`);
  }

  save(channel: Channel) {
    return this.http.post<Channel>(`${environment.api}/protected/channel`, channel);
  }

  update(channel: Channel) {
    return this.http.put<Channel>(`${environment.api}/protected/channel/`, channel);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.api}/protected/channel/${id}`);
  }
}
