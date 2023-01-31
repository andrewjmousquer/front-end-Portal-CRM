import { ClassifierEnum } from "../enum/classifier-enum";
import { PersonClassifierEnum } from "../enum/person-classifier-enum";
import { Classifier } from "../model/classifier.model";

export const PersonClassificationDictionary: Classifier[] = [
  {
    id: 30,
    value: PersonClassifierEnum.physical,
    type: ClassifierEnum.PERSON_CLASSIFICATION,
    label: 'Física',
    description: 'Classificação da pessoa, pessoa física'
  },
  {
    id: 29,
    value: PersonClassifierEnum.legal,
    type: ClassifierEnum.PERSON_CLASSIFICATION,
    label: 'Jurídica',
    description: 'Classificação da pessoa, pessoa jurídica'
  },
  {
    id: 31,
    value: PersonClassifierEnum.foreign,
    type: ClassifierEnum.PERSON_CLASSIFICATION,
    label: 'Estrangeiro',
    description: 'Classificação da pessoa, pessoa estrangeira'
  }
];
