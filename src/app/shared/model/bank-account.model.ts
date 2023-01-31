import { Bank } from "./bank.model";

export class BankAccount {
  public id: number;
  public agency: string;
  public accountNumber: string;
  public pixKey: boolean;
  public type: string;
  public bank: Bank;
  public label: string;
}
