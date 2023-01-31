import { Classifier } from "./classifier.model";
import { PersonClassifierEnum } from "../enum/person-classifier-enum";
import { PersonDocumentEnum } from "../enum/person-document-enum";
import { CnpjPipe } from "../pipe/cnpj.pipe";
import { CpfPipe } from "../pipe/cpf.pipe";
import { Person } from "./person.model";
import { ProposalList } from "./proposal-list";

export class ProposalPerson {
    public person: Person;
    public proposalPersonClassification: Classifier;

    public previousProposals: ProposalList[];

    // control frontend
    public email: string;
    public phone: string;

    getDocumentName() {
        return this.person.classification.value == PersonClassifierEnum.physical ? PersonDocumentEnum.PF :
            this.person.classification.value == PersonClassifierEnum.legal ? PersonDocumentEnum.PJ : PersonDocumentEnum.ESTRANGEIRO;
    }

    getDocumentValue() {
        return this.person.classification.value == PersonClassifierEnum.physical ? new CpfPipe().transform(this.person.cpf) :
            this.person.classification.value == PersonClassifierEnum.legal ? new CnpjPipe().transform(this.person.cnpj) : this.person.rne;
    }
}
