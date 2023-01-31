import { Classifier } from "../model/classifier.model";

export const FromToDictionary: Classifier[] = [
  { id: 1, value: 'Todos', type: 'ALL' },
  { id: 2, value: 'À Partir de', type: 'FROM' },
  { id: 3, value: 'Até', type: 'TO' },
  { id: 4, value: 'De/Até', type: 'FROMTO' }
];
