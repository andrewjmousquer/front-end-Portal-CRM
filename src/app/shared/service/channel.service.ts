import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Channel } from "src/app/shared/model/channel-model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ChannelService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Channel[]>(`${environment.api}/protected/channel`)
  }

  find(channel: Channel) {
    return this.http.post<Channel[]>(`${environment.api}/protected/channel/find`, channel);
  }
}
