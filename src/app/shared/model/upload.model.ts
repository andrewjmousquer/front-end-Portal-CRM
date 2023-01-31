import { Classifier } from "./classifier.model";
import { DocumentModel } from "./document.model";

export class Upload {
 

  public id: number;
  public name: Classifier;
  public userUpload: string;
  public dateUpload: Date;
  public file: string;


  static of(document: DocumentModel, file: string): Upload {
    const upload = new Upload();
    upload.id = document.id;
    upload.name = document.type;
    upload.userUpload = document?.user?.person?.name;
    upload.dateUpload = document?.createDate;
    upload.file = file;
    return upload;
  }
}
