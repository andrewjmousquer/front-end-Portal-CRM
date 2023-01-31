import { Classifier } from "./classifier.model";
import { User } from "./user.model";

export class DocumentModel {
    public id: number;
    public fileName: string;
    public filePath: string;
    public contentType: string;
    public description: string;
    public createDate: Date;
    public type: Classifier;
    public user: User;

    // Controle de front-end
    public file: File;
}