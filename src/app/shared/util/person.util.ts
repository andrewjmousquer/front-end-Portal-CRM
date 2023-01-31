import { Injectable } from '@angular/core';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { PersonClassificationDictionary } from '../dictionary/person-classification.dictionary';
import { PersonClassifierEnum } from '../enum/person-classifier-enum';
import { Classifier } from '../model/classifier.model';
import { Person } from '../model/person.model';
import { Utils } from './util';

@Injectable({ providedIn: 'root' })
export class PersonUtil {

  static getDocumentPerson(person: Person) {
    switch (person.classification.value) {
      case PersonClassifierEnum.physical:
        const cpfClean = Utils.removeMask(person.cpf);
        if(!person.cpf){
          return 'null';
        } else if (cpfClean && cpf.isValid(cpfClean)){
          return cpfClean;
        } else {
          return 'false';
        }

      case PersonClassifierEnum.legal:
        const cnpjClean = Utils.removeMask(person.cnpj);
        if(!person.cnpj){
          return 'null';
        } else if (cnpjClean && cnpj.isValid(cnpjClean)) {
          return cnpjClean;
        } else {
          return 'false';
        }
      case PersonClassifierEnum.foreign:
        // const rne = Utils.removeMask(person.rne);
        // if(!person.rne){
        //   return 'null';
        // } else if (rne) {
        //   return rne;
        // }
        return person.rne;
    }
  }

  static correctClassification(person: Person, list?: Classifier[]) {
    list = list || PersonClassificationDictionary;
    person.classification = list.filter(c => {
      return c.value == person.classification.value
    })[0];
    return person;
  }
}
