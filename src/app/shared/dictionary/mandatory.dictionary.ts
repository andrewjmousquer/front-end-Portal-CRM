import { MandatoryEnum } from "../enum/mandatory-enum";
import { Classifier } from "../model/classifier.model";

export const MandatoryDictionary: Classifier[] = [
  { id: 22, value: 'Sugerido', type: MandatoryEnum.suggested },
  { id: 23, value: 'Obrigatório', type: MandatoryEnum.required },
  { id: 24, value: 'Não obrigatório', type: MandatoryEnum.optional }
];
