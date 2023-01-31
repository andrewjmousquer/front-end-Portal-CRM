import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { ProposalDTO } from "../dto/proposal/proposal.dto";
import { DocumentModel } from "../model/document.model";
import { Proposal } from "../model/proposal";

@Injectable({
    providedIn: 'root'
})
export class ProposalDocumentService {

    constructor(private http: HttpClient) {
    }

    upload(file: File, id: number) {
        const formData: FormData = new FormData;
        formData.append('file', file);
        return this.http.post<DocumentModel>(`${environment.api}/protected/proposaldocument/upload/${id}`, formData);
    }

    uploadToProposal(files: File[], fIds: number[], proposalId: number) {
        const formData: FormData = new FormData;
        let params = new HttpParams();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                formData.append('file', file);
                params = params.append("fId", fIds[i]);
            }
        }
        return this.http.post<DocumentModel[]>(`${environment.api}/protected/proposaldocument/${proposalId}/upload`, formData, { params: params });
    }

    uploadMultiple(files: File[], id: number) {
        const formData: FormData = new FormData;
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i])
        }
        return this.http.post<DocumentModel>(`${environment.api}/protected/proposaldocument/uploadMultiple/${id}`, formData);
    }


    getDocument(id: number) {
        return this.http.get<any>(`${environment.api}/protected/proposaldocument/document/${id}`);
    }

    removeDocument(idProposal: number,idDocument: number) {
        return this.http.delete<boolean>(`${environment.api}/protected/proposaldocument/document/${idProposal}/${idDocument}`);
    }
}
