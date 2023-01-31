import { Classifier } from './classifier.model';
import { Person } from './person.model';

export class PersonHolding {
  public id: number;
  // public name: string;
  // public cpf: string;
  // public cnpj: string;
  // public rne: string;
  // public rg: string;
  public email: string;
  public phone: string;
  public classification: string;

  public person: Person;
}
