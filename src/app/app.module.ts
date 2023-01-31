import { LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import * as _ from "lodash";

import localePt from "@angular/common/locales/pt";
registerLocaleData(localePt, 'pt');

import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from './shared/service/authentication.service';
import { AuthGuard } from './core/auth.guard';
import { ErrorInterceptor } from './core/error.interceptor';
import { JwtInterceptor } from './core/jwt.interceptor';
import { LoaderInterceptor } from './core/loader.interceptor';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxUploaderDirectiveModule } from 'ngx-uploader-directive';
import { OrderListModule } from 'primeng/orderlist';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { QRCodeModule } from 'angularx-qrcode';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from "primeng/tree";
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { KeyFilterModule } from 'primeng/keyfilter';

import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AboutComponent } from './portal/template/about/about.component';
import { AccessListFormComponent } from './portal/form/access-list-form/access-list-form.component';
import { AppComponent } from './app.component';
import { CheckpointFormComponent } from './portal/form/checkpoint-form/checkpoint-form.component'
import { ClassifierFormComponent } from './portal/form/classifier-form/classifier-form.component';
import { ContactComponent } from './shared/component/contact/contact.component';
import { FieldComponent } from './shared/component/field/field.component';
import { ButtonComponent } from './shared/component/button/button.component';

import { PersonTabComponent } from './shared/component/person/person-tab/person-tab.component';
import { PersonModalComponent } from './shared/component/person/person-modal/person-modal.component';
import { PersonResumeComponent } from './shared/component/person/person-resume/person-resume.component';
import { QualificationComponent } from './shared/component/qualification/qualification.component';

import { ErrorComponent } from './portal/template/error/error.component';
import { FooterComponent } from './portal/template/footer/footer.component';
import { HeaderComponent } from './portal/template/header/header.component';
import { HoldingFormComponent } from './portal/form/holding-form/holding-form.component'
import { LoginComponent } from './portal/template/login/login.component';
import { LogoutComponent } from './portal/template/logout/logout.component';
import { MenuComponent } from './portal/template/menu/menu.component';
import { MenuitemComponent } from './portal/template/menu/menuitem.component';
import { MenuFormComponent } from './portal/form/menu-form/menu-form.component';
import { ParameterFormComponent } from './portal/form/parameter-form/parameter-form.component';
import { ReportComponent } from './portal/template/report/report.component';
import { SettingsFormComponent } from './portal/form/settings-form/settings-form.component';
import { UserFormComponent } from './portal/form/user-form/user-form.component';

import { CepDirectiveDirective } from './shared/directive/cep-mask.directive';
import { CnpjMaskDirective } from './shared/directive/cnpj-mask.directive';
import { PhoneMaskDirective } from './shared/directive/phone-mask.directive';
import { DateMaskDirective } from './shared/directive/date-mask.directive';

import { MenuItemService } from './portal/template/menu/menu.service';
import { MenuService } from './shared/service/menu.service';

import { CnpjPipe } from './shared/pipe/cnpj.pipe';
import { CpfPipe } from './shared/pipe/cpf.pipe';
import { CepPipe } from './shared/pipe/cep.pipe';
import { PhonePipe } from './shared/pipe/phone.pipe';

import { TimeFormatPipe } from './shared/pipe/time-format.pipe';

import { HomeComponent } from './portal/template/home/home.component';
import { PortionFormComponent } from './page/portion-form/portion-form.component';
import { HistoryFormComponent } from './page/history-form/history-form.component';
import { CurrencyFormatPipe } from './shared/pipe/currency.pipe';
import { BrandFormComponent } from './page/brand-form/brand-form.component';
import { ModelFormComponent } from './page/model-form/model-form.component';
import { BankFormComponent } from './page/bank-form/bank-form.component';
import { ChannelFormComponent } from './page/channel-form/channel-form.component';
import { PartnerGroupFormComponent } from './page/partner-group-form/partner-group-form.component';
import { ProductFormComponent } from './page/product-form/product-form.component';
import { ItemTypeFormComponent } from './page/item-type-form/item-type-form.component';
import { SourceFormComponent } from './page/source-form/source-form.component';
import { VehicleFormComponent } from './page/vehicle-form/vehicle-form.component';
import { QualificationFormComponent } from './page/qualification-form/qualification-form.component';
import { LeadFormComponent } from "./page/lead-form/lead-form.component";
import { ItemFormComponent } from './page/item-form/item-form.component';
import { PriceListFormComponent } from './page/price-list-form/price-list-form.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpLoaderFactory } from "./shared/factory/http-loader.factory";
import { ProposalSearchComponent } from './page/proposal/proposal-search/proposal-search.component';
import { ProposalFormComponent } from './page/proposal/proposal-form/proposal-form.component';
import { PersonFormComponent } from './page/person-form/person-form.component';
import { PaymentruleFormComponent } from './page/paymentrule-form/paymentrule-form.component';
import { PaymentmethodFormComponent } from './page/paymentmethod-form/paymentmethod-form.component';
import { SaleTeamFormComponent } from './page/salesteam-form/salesteam-form.component';
import { PartnerFormComponent } from './page/partner-form/partner-form.component';
import { SellerFormComponent } from "./page/seller-form/seller-form.component";
import { ProposalApprovalComponent } from './page/proposal/proposal-approval/proposal-approval.component';
import { ProposalPartnerComponent } from "./page/proposal/proposal-form/components/proposal-partner/proposal-partner.component";
import { ProposalCustomerComponent } from "./page/proposal/proposal-form/components/proposal-customer/proposal-customer.component";
import { ProposalFollowUpComponent } from "./page/proposal/proposal-form/components/proposal-follow-up/proposal-follow-up.component";
import { ProposalExternalComissionComponent } from "./page/proposal/proposal-form/components/proposal-external-comission/proposal-external-comission.component";
import { ProposalInternalComissionComponent } from "./page/proposal/proposal-form/components/proposal-internal-comission/proposal-internal-comission.component";
import { ProposalDocumentsComponent } from "./page/proposal/proposal-form/components/proposal-documents/proposal-documents.component";
import { ProposalHeaderComponent } from './page/proposal/proposal-form/components/proposal-header/proposal-header.component';
import { ProposalResumeComponent } from './page/proposal/proposal-form/components/proposal-resume/proposal-resume.component';
import { ProposalFooterComponent } from './page/proposal/proposal-form/components/proposal-footer/proposal-footer.component';
import { ExternalComissionComponent } from "./page/proposal/proposal-form/components/external-comission/external-comission.component";
import { ProposalResumePrintComponent } from "./page/proposal/proposal-form/components/proposal-resume-print/proposal-resume-print.component";
import { QualificationRegisterFormComponent } from './page/qualification-register-form/qualification-register-form.component';
import { ProposalApprovalRuleComponent } from './page/proposal-approval-rule/proposal-approval-rule.component';
import { ProductModelCostFormComponent } from "./page/product-model-cost/product-model-cost-form/product-model-cost-form.component";
import { ProductModelCostDuplicateSingleComponent } from './page/product-model-cost/product-model-cost-duplicate-single/product-model-cost-duplicate-single.component';
import { ProposalViewComponent } from './page/proposal/proposal-view/proposal-view.component';
import { ProductModelCostDuplicateMultipleComponent } from "./page/product-model-cost/product-model-cost-duplicate-multiple/product-model-cost-duplicate-multiple.component";
import { ProductModelCostUpdateValuesComponent } from "./page/product-model-cost/product-model-cost-update-values/product-model-cost-update-values.component";
import { ProductModelCostUpdatePeriodsComponent } from "./page/product-model-cost/product-model-cost-update-periods/product-model-cost-update-periods.component";
import { ModelItemCostComponent } from './page/model-item-cost/model-item-cost.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    FullCalendarModule,
    GalleriaModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScrollPanelModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    VirtualScrollerModule,
    DividerModule,
    ChipModule,
    BadgeModule,
    TagModule,
    KeyFilterModule,
    QRCodeModule,
    NgxSpinnerModule,
    NgxUploaderDirectiveModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AppComponent,
    ErrorComponent,
    LoginComponent,
    LogoutComponent,
    MenuComponent,
    MenuitemComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AccessListFormComponent,
    CheckpointFormComponent,
    ParameterFormComponent,
    UserFormComponent,
    MenuFormComponent,
    HoldingFormComponent,
    ContactComponent,
    FieldComponent,
    ButtonComponent,
    PersonTabComponent,
    PersonModalComponent,
    PersonResumeComponent,
    ProposalResumeComponent,
    QualificationComponent,
    CnpjPipe,
    CpfPipe,
    CepPipe,
    PhonePipe,
    TimeFormatPipe,
    CurrencyFormatPipe,
    PhoneMaskDirective,
    CnpjMaskDirective,
    CepDirectiveDirective,
    DateMaskDirective,
    SettingsFormComponent,
    AboutComponent,
    ReportComponent,
    ClassifierFormComponent,
    PortionFormComponent,
    HistoryFormComponent,
    BrandFormComponent,
    ModelFormComponent,
    BankFormComponent,
    ChannelFormComponent,
    PartnerGroupFormComponent,
    ProductFormComponent,
    ItemTypeFormComponent,
    SourceFormComponent,
    VehicleFormComponent,
    QualificationFormComponent,
    LeadFormComponent,
    ItemFormComponent,
    PriceListFormComponent,
    ProposalSearchComponent,
    ProposalFormComponent,
    PersonFormComponent,
    PaymentruleFormComponent,
    PaymentmethodFormComponent,
    SaleTeamFormComponent,
    SellerFormComponent,
    PartnerFormComponent,
    QualificationRegisterFormComponent,
    ProposalApprovalComponent,
    ProposalPartnerComponent,
    ProposalCustomerComponent,
    ProposalFollowUpComponent,
    ProposalExternalComissionComponent,
    ProposalInternalComissionComponent,
    ProposalDocumentsComponent,
    ProposalHeaderComponent,
    ProposalFooterComponent,
    ExternalComissionComponent,
    ProposalResumePrintComponent,
    ProposalApprovalRuleComponent,
    ProductModelCostFormComponent,
    ProductModelCostDuplicateSingleComponent,
    ProductModelCostDuplicateMultipleComponent,
    ProductModelCostUpdateValuesComponent,
    ProductModelCostUpdatePeriodsComponent,
    ProposalViewComponent,
    ModelItemCostComponent
  ],
  entryComponents: [AppComponent, AboutComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthenticationService,
    AuthGuard,
    MenuService,
    MenuItemService,
    DialogService,
    ConfirmationService,
    DatePipe,
    CnpjPipe,
    CpfPipe,
    PhonePipe,
    CurrencyFormatPipe,
    MessageService,
    DynamicDialogRef,
    DynamicDialogConfig
  ],
  exports: [
    PhoneMaskDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
