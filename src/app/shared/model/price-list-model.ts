import { Channel } from './channel-model';

export class PriceList {
  public id: number;
  public name: string;
  public start: Date;
  public end: Date;
  public channel: Channel;
  public allPartners: Boolean;
  public first: number;
}
