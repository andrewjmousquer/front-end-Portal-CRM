import { Classifier } from './classifier.model';
import { Person } from './person.model';

export class Contact {
  public id: number;
  public value: string;
  public type: Classifier;
  public complement: string;
  public person: Person;
}
