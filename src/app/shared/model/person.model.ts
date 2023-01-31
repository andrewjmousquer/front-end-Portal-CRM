import { ContactEnum } from '../enum/contact-enum';
import { Address } from './address.model';
import { BankAccount } from './bank-account.model';
import { Classifier } from './classifier.model';
import { Contact } from './contact.model';
import { PersonQualification } from './person-qualification.model';
import { PersonRelated } from './person-related.model';

export class Person {
  public id: number;
  public name: string;
  public corporateName?: string;
  public jobTitle?: string;
  public cpf?: string;
  public cnpj?: string;
  public ie?: string;
  public rne?: string;
  public rg?: string;
  public address?: Address;
  public classification?: Classifier;
  public contacts?: Contact[];
  public qualifications?: PersonQualification[];
  public bankAccount?: BankAccount[];
  public personRelated?: PersonRelated[];
  public birthdate?: Date;
  public negativeList?: Classifier;
  public user?: boolean;
  public first?: number;

  getEmail() : string {
    return this.contacts ? this.contacts.find(c => c.type && c.type.value == ContactEnum.EMAIL)?.value : null;
  }

  getPhone() : string {
    return this.contacts ? this.contacts.find(c => c.type && (c.type.value == ContactEnum.CELULAR || c.type.value == ContactEnum.TELEFONE))?.value : null;
  }
}
