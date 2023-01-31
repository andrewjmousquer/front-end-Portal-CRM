import { AccessList } from './access-list.model';
import { Contact } from './contact.model';
import { Customer } from './customer.model';
import { Person } from './person.model';
import { Classifier } from './classifier.model';

export class User {
  public id: number;
  public username: string;
  public password: string;
  public confirmPassword: string;
  public enabled: boolean;
  public blocked: boolean;
  public changePass: boolean;
  public expirePass: boolean;
  public accessList: AccessList;
  public userType: Classifier;
  public token: string;
  public person: Person;
  public customer: Customer;
  public customers: Customer[];
  public config: string;
  public first: number;

  constructor() {
    this.userType = new Classifier();
    this.person = new Person();
    this.customer = new Customer();
  }
}
