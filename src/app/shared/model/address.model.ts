import { City } from './city.model';
import { Country } from './country.model';
import { State } from './state.model';

export class Address {
  public id: number;
  public street: string;
  public number: string;
  public district: string;
  public complement: string;
  public zipCode: string;
  public latitude: string;
  public longitude: string;
  public city: City;
  public state: State;
  public country: Country;
}
