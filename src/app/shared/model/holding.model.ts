import { Address } from "./address.model";
import { Customer } from "./customer.model";
import { Person } from "./person.model";
import { Classifier } from './classifier.model'
export class Holding {
  public id: number;
  public name: string;
  public socialName: string;
  public logo: string;
  public cnpj: string;
  public stateRegistration: string;
  public municipalRegistration: string;
  public address: Address;
  public person: Person;
  public customers: Customer[];
  public deletedCustomers: Customer[];
  public type: Classifier;
  public first: number;
}
