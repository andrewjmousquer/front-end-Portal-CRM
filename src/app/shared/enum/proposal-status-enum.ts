export enum ProposalStatusEnum {
  inProgress = "IN_PROGRESS", // EM ANDAMENTO
  inCommercialApproval = "IN_COMMERCIAL_APPROVAL", // EM APROVAÇÃO COMERCIAL
  commercialDisapproved = "COMMERCIAL_DISAPPROVED", // REPROVADO COMERCIAL
  commercialApproved = "COMMERCIAL_APPROVED", // APROVADO COMERCIAL
  onCustomerApproval = "ON_CUSTOMER_APPROVAL", // EM APROVAÇÃO CLIENTE
  finishedWithoutSale = "FINISHED_WITHOUT_SALE", // FINALIZADA SEM VENDA
  finishedWithSale = "FINISHED_WITH_SALE", // FINALIZADA COM VENDA
  canceled = "CANCELED", // CANCELADO
}

