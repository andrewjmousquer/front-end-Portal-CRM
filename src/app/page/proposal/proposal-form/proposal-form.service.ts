import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Partner } from 'src/app/shared/model/partner.model';
import { environment } from '../../../../environments/environment';
import { Brand } from 'src/app/shared/model/brand.model';
import { Product } from 'src/app/shared/model/product.model';
import { ProposalProductItemFormDTO } from 'src/app/shared/dto/proposal/proposal-product-item-form.dto';
import { ProposalFormProduct } from 'src/app/shared/model/proposal-form-product.model';
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { Seller } from 'src/app/shared/model/seller.model';
import { ProposalDocumentService } from 'src/app/shared/service/proposal-document.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalFormService {

  partner: Partner;

  constructor(private http: HttpClient,
     private proposalDocumentService: ProposalDocumentService ) { }

  getPartnerByChannel(id: number) {
    return this.http.get<Partner[]>(`${environment.api}/protected/proposal/listPartnerByChannel/${id}`);
  }

  getExecutiveList() {
    return this.http.get<Seller[]>(`${environment.api}/protected/proposal/getExecutiveList`);
  }
  
  getSellerByExecutive(id: number) {
    return this.http.get<Seller[]>(`${environment.api}/protected/proposal/listSellerByExecutive/${id}`);
  }

  
  getBrandByPartner(id?: number, chnId?: number) {
    return this.http.get<Brand[]>(`${environment.api}/protected/proposal/listBrandByPartner/${id}/${chnId}`);
  }

  getProductByModel(id: number, year: number) {
    return this.http.get<Product[]>(`${environment.api}/protected/proposal/listProductByModel/${id}/${year}`);
  }

  getProductByModelV1(id: number, year: number, ptnId?: number, chnId?: number) {

    let  params =   new HttpParams()
    
    params = params.append('id', id)
    params = params.append('year', year)
    
    if(chnId){
      params = params.append('chnId', chnId)
    } 
    
    if(ptnId){
      params = params.append('ptnId', ptnId)
    }
    

    return this.  http.get<Product[]>(`${environment.api}/protected/proposal/listProductByModel/v1`,{params});
  }

  getListProductItems(product: ProposalProductItemFormDTO) {
    return this.http.post<ProposalFormProduct>(`${environment.api}/protected/proposal/listProductItems`, product);
  }

  save(proposal: ProposalDTO){
    return this.http.post<ProposalDTO>(`${environment.api}/protected/proposal/`, proposal);
  }

  update(proposal: ProposalDTO){
    return this.http.put<ProposalDTO>(`${environment.api}/protected/proposal/`, proposal);
  }

  getSellerList() {
    return this.http.get<Seller[]>(`${environment.api}/protected/proposal/listInternalSeller`);
  }

  getPartnerByChannelAndSeller(channelId: number, sellerId: number) {
    return this.http.get<Partner[]>(`${environment.api}/protected/proposal/listPartnerByChannel/${channelId}/seller/${sellerId}`);
  }

  downloadProposalReport(proposalNumber: string) {
    return this.http.post(`${environment.api}/protected/proposal/getProposalReport/${proposalNumber}`, proposalNumber,{
        observe: 'response', responseType: 'blob'
    });
  }

  upload(file: File, id: number) {
    return this.proposalDocumentService.upload(file, id);
  }

  uploadToProposal(files: File[], fIds: number[], proposalId: number) {
    return this.proposalDocumentService.uploadToProposal(files, fIds, proposalId);
  }

  uploadMultiple(files: File[], id: number) {
    return this.proposalDocumentService.uploadMultiple(files, id);
  }

  getDocument(id: number) {
    return this.proposalDocumentService.getDocument(id);
  }
}
