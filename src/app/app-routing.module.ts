import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

import { ClassifierFormComponent } from './portal/form/classifier-form/classifier-form.component';
import { AccessListFormComponent } from './portal/form/access-list-form/access-list-form.component';
import { CheckpointFormComponent } from './portal/form/checkpoint-form/checkpoint-form.component';
import { MenuFormComponent } from './portal/form/menu-form/menu-form.component';
import { ParameterFormComponent } from './portal/form/parameter-form/parameter-form.component';
import { UserFormComponent } from './portal/form/user-form/user-form.component';
import { HoldingFormComponent } from './portal/form/holding-form/holding-form.component';
import { LoginComponent } from './portal/template/login/login.component';
import { LogoutComponent } from './portal/template/logout/logout.component';
import { HomeComponent } from './portal/template/home/home.component';
import { ReportComponent } from './portal/template/report/report.component';
import { SettingsFormComponent } from './portal/form/settings-form/settings-form.component';
import { ErrorComponent } from './portal/template/error/error.component';
import { PortionFormComponent } from './page/portion-form/portion-form.component';
import { HistoryFormComponent } from './page/history-form/history-form.component';
import { BrandFormComponent } from './page/brand-form/brand-form.component';
import { ModelFormComponent } from './page/model-form/model-form.component';
import { BankFormComponent } from './page/bank-form/bank-form.component';
import { ChannelFormComponent } from './page/channel-form/channel-form.component';
import { PartnerGroupFormComponent } from './page/partner-group-form/partner-group-form.component';
import { ProductFormComponent } from './page/product-form/product-form.component';
import { ItemTypeFormComponent } from './page/item-type-form/item-type-form.component';
import { SourceFormComponent } from './page/source-form/source-form.component';
import { VehicleFormComponent } from './page/vehicle-form/vehicle-form.component';
import { LeadFormComponent } from './page/lead-form/lead-form.component';
import { QualificationFormComponent } from './page/qualification-form/qualification-form.component';
import { ItemFormComponent } from './page/item-form/item-form.component';
import { PriceListFormComponent } from './page/price-list-form/price-list-form.component';
import { ProductModelCostFormComponent } from './page/product-model-cost/product-model-cost-form/product-model-cost-form.component';
import { ProposalSearchComponent } from './page/proposal/proposal-search/proposal-search.component';
import { ProposalFormComponent } from './page/proposal/proposal-form/proposal-form.component';
import { ProposalApprovalComponent } from './page/proposal/proposal-approval/proposal-approval.component';
import { PersonFormComponent } from './page/person-form/person-form.component';
import { PaymentruleFormComponent } from './page/paymentrule-form/paymentrule-form.component';
import { PaymentmethodFormComponent } from './page/paymentmethod-form/paymentmethod-form.component';
import { SaleTeamFormComponent } from './page/salesteam-form/salesteam-form.component';
import { PartnerFormComponent } from './page/partner-form/partner-form.component';
import { SellerFormComponent } from './page/seller-form/seller-form.component';
import { QualificationRegisterFormComponent } from './page/qualification-register-form/qualification-register-form.component';
import { ProposalApprovalRuleComponent } from './page/proposal-approval-rule/proposal-approval-rule.component';
import { ModelItemCostComponent } from './page/model-item-cost/model-item-cost.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'accesslist-form', component: AccessListFormComponent, canActivate: [AuthGuard] },
  { path: 'checkpoint-form', component: CheckpointFormComponent, canActivate: [AuthGuard] },
  { path: 'holding-form', component: HoldingFormComponent, canActivate: [AuthGuard] },
  { path: 'menu-form', component: MenuFormComponent, canActivate: [AuthGuard] },
  { path: 'parameter-form', component: ParameterFormComponent, canActivate: [AuthGuard] },
  { path: 'settings-form', component: SettingsFormComponent, canActivate: [AuthGuard] },
  { path: 'user-form', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'classifier-form', component: ClassifierFormComponent, canActivate: [AuthGuard] },
  { path: 'portion-form', component: PortionFormComponent, canActivate: [AuthGuard] },
  { path: 'brand-form', component: BrandFormComponent, canActivate: [AuthGuard] },
  { path: 'model-form', component: ModelFormComponent, canActivate: [AuthGuard] },
  { path: 'bank-form', component: BankFormComponent, canActivate: [AuthGuard] },
  { path: 'channel-form', component: ChannelFormComponent, canActivate: [AuthGuard] },
  { path: 'history-form', component: HistoryFormComponent, canActivate: [AuthGuard] },
  { path: 'partner-form', component: PartnerFormComponent, canActivate: [AuthGuard] },
  { path: 'partner-group-form', component: PartnerGroupFormComponent, canActivate: [AuthGuard] },
  { path: 'product-form', component: ProductFormComponent, canActivate: [AuthGuard] },
  { path: 'qualification-form', component: QualificationFormComponent, canActivate: [AuthGuard] },
  { path: 'itemtype-form', component: ItemTypeFormComponent, canActivate: [AuthGuard] },
  { path: 'source-form', component: SourceFormComponent, canActivate: [AuthGuard] },
  { path: 'vehicle-form', component: VehicleFormComponent, canActivate: [AuthGuard] },
  { path: 'lead-form', component: LeadFormComponent, canActivate: [AuthGuard] },
  { path: 'item-form', component: ItemFormComponent, canActivate: [AuthGuard] },
  { path: 'price-list-form', component: PriceListFormComponent, canActivate: [AuthGuard] },
  { path: 'proposal-search', component: ProposalSearchComponent, canActivate: [AuthGuard] },
  { path: 'proposal-form', component: ProposalFormComponent, canActivate: [AuthGuard] },
  { path: 'proposal-form/:id', component: ProposalFormComponent, canActivate: [AuthGuard] },
  { path: 'proposal-approval', component: ProposalApprovalComponent, canActivate: [AuthGuard] },
  { path: 'proposal-approval-rule', component: ProposalApprovalRuleComponent, canActivate: [AuthGuard] },
  { path: 'product-model-cost-form', component: ProductModelCostFormComponent, canActivate: [AuthGuard] },
  { path: 'person-form', component: PersonFormComponent, canActivate: [AuthGuard] },
  { path: 'paymentrule-form', component: PaymentruleFormComponent, canActivate: [AuthGuard] },
  { path: 'paymentmethod-form', component: PaymentmethodFormComponent, canActivate: [AuthGuard] },
  { path: 'salesteam-form', component: SaleTeamFormComponent, canActivate: [AuthGuard] },
  { path: 'seller-form', component: SellerFormComponent, canActivate: [AuthGuard] },
  { path: 'qualification-register-form', component: QualificationRegisterFormComponent, canActivate: [AuthGuard] },

  { path: 'model-item-cost-form', component: ModelItemCostComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const appRoutingModule = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });
