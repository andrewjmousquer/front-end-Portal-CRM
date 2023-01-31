import { Classifier } from './classifier.model';

export class Customer {
  public id: number;
  public name: string;
  public cnpj: string;
  public c_type: string;
  public type: Classifier;
}
