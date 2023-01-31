import { Portion } from "./portion.model";
import { User } from "./user.model";

export class Sale {
  public id: number;
  public customer: string;
  public contact: string;
  public comments: string;
  public date: Date;
  public dateEnd: Date;
  public value: number;
  public firstPayment: number;
  public tax: number;
  public portion: string;
  public paymentType: string;
  public user: User;
  public first: number;
  public rows: number;
}
