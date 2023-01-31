import { Classifier } from "../model/classifier.model";

export const ProposalStateDictionary: Classifier[] = [
  { id: 61, label: 'Em Andamento', value: 'IN_PROGRESS', type: 'PROPOSAL_STATUS'},
  { id: 62, label: 'Em Aprovação Comercial', value: 'IN_COMMERCIAL_APPROVAL', type: 'PROPOSAL_STATUS'},
  { id: 63, label: 'Reprovado Comercial', value: 'COMMERCIAL_DISAPPROVED', type: 'PROPOSAL_STATUS'},
  { id: 64, label: 'Aprovado Comercial', value: 'COMMERCIAL_APPROVED', type: 'PROPOSAL_STATUS'},
  { id: 65, label: 'Em Aprovação Cliente', value: 'ON_CUSTOMER_APPROVAL', type: 'PROPOSAL_STATUS'},
  { id: 66, label: 'Finalizada Sem Venda', value: 'FINISHED_WITHOUT_SALE', type: 'PROPOSAL_STATUS'},
  { id: 67, label: 'Finalizada Com Venda', value: 'FINISHED_WITH_SALE', type: 'PROPOSAL_STATUS'},
  { id: 68, label: 'Cancelado', value: 'CANCELED', type: 'PROPOSAL_STATUS'},
];
