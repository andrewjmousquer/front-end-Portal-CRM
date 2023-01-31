import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { first } from 'rxjs/operators';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { DocumentModel } from 'src/app/shared/model/document.model';
import { Person } from 'src/app/shared/model/person.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { Upload } from 'src/app/shared/model/upload.model';
import { User } from 'src/app/shared/model/user.model';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ParameterService } from 'src/app/shared/service/parameter.service';
import { ProposalDocumentService } from 'src/app/shared/service/proposal-document.service';
import { FileUtil } from 'src/app/shared/util/file.util';
import { generalEnvironments } from 'src/environments/environment.general';

@Component({
  selector: 'wbp-proposal-documents',
  templateUrl: './proposal-documents.component.html',
})
export class ProposalDocumentsComponent implements OnInit {

  @Input() proposal: Proposal;
  @Output() proposalChange = new EventEmitter<Proposal>();

  documentTypeList: Classifier[];

  selectedDocumentType: Classifier;

  documentList: DocumentModel[] = [];

  documents: Upload[] = [];

  pdf: boolean = false;

  minBytesFileSize: number = Number(generalEnvironments.minFileUploadSize);
  maxBytesFileSize: number = Number(generalEnvironments.maxFileUploadSize);

  constructor(private proposalDocumentService: ProposalDocumentService,
    private parameterService: ParameterService,
    private messageService: MessageService,
    private classifierService: ClassifierService) { }

  ngOnInit(): void {
    this.resetDocumentList();
    this.loadDefaultUploadBytesSize();
    this.loadTypesDocument()
  }

  ngOnChanges(): void {
    if (this.proposal != null) {
      if (this.proposal.documents != null) {
        if (this.proposal.documents.length > 0) {
          if (JSON.stringify(this.proposal.documents) !== JSON.stringify(this.documentList)) {
            this.resetDocumentList();

            this.documentList = this.proposal.documents;

            this.documentList.forEach(document => {
              this.fetchDocument(document);
            });
          }
        }
      }
    }
  }

  loadDefaultUploadBytesSize() {
    this.parameterService.searchByName("MAX_FILE_UPLOAD_SIZE").pipe(first()).subscribe(data => {
      if (data && data.length > 0) {
        this.maxBytesFileSize = Number(data[0].value);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });

    this.parameterService.searchByName("MIN_FILE_UPLOAD_SIZE").pipe(first()).subscribe(data => {
      if (data && data.length > 0) {
        this.minBytesFileSize = Number(data[0].value);
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadTypesDocument() {

    this.classifierService.searchByType('DOCUMENT_TYPE').pipe(first()).subscribe(data => {
      if (data) {
        this.documentTypeList = data
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetDocumentList() {
    this.documents = [];
    this.documentList = [];
  }

  onLocalUpload(event, uploader: FileUpload) {
    let uploaded: boolean = true;
    this.pdf = false;
    for (let file of event.files) {
      if (!FileUtil.isImageAndPdf(file.name) && uploaded) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Tipo de arquivo inválido, permitido apenas imagem e pdf!' });
        uploader.remove(event, 0);
        uploaded = false;
      }

      if (file.size > this.maxBytesFileSize || file.size < this.minBytesFileSize && uploaded) {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Não foi possível selecionar o arquivo!',
          detail: 'O arquivo não corresponde ao tamanho exigido. Mínimo ' + FileUtil.formatSizeUnits(this.minBytesFileSize) + ' e Máximo ' + FileUtil.formatSizeUnits(this.maxBytesFileSize),
        });
        uploader.remove(event, 0);
        uploaded = false;
      }

      if (uploaded) {
        let self = this;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const person = new Person();
          person.name = this.proposal.proposalDetail.seller.person.name
          const user = new User();
          user.person = person;
          const documentModel = new DocumentModel(); 
          documentModel.user = user;
          documentModel.createDate = new Date();

          let url = reader.result.toString();
          if (url.startsWith("data:application/pdf")){
            url = '../assets/pdf_icon.png';
          }

          self.documents.push(Upload.of(documentModel, url));
          documentModel.file = file;
          documentModel.type = this.selectedDocumentType;
          if (self.proposal.documents === undefined) {
            self.proposal.documents = [];
          }
          self.proposal.documents.push(documentModel)
          self.proposalChange.emit(self.proposal);
        }
        uploader.remove(event, 0);
      }
    }
  }

  fetchDocument(document: DocumentModel) {
    this.proposalDocumentService.getDocument(document.id).pipe(first()).subscribe(base64 => {
      let fileUrl: string;
      if (document.contentType === 'application/pdf') {
        fileUrl = '../assets/pdf_icon.png';
      } else {
        fileUrl = 'data:image/jpg;base64,' + base64.file;
      }
      this.documents.push(Upload.of(document, fileUrl));
    }, error => {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível localizar o documento.'
      });
    });
  }

  removeDocument(document) {
    let index = this.documents.indexOf(document)
    this.documents.splice(index, 1);
    this.proposal.documents.splice(index, 1);
    this.proposalChange.emit(this.proposal);
  }
}
