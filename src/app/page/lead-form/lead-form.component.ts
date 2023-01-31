import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Brand } from 'src/app/shared/model/brand.model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Lead } from 'src/app/shared/model/lead.model';
import { Model } from 'src/app/shared/model/model.model';
import { Source } from 'src/app/shared/model/source.model';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { LeadService } from 'src/app/shared/service/lead.service';
import { SourceService } from 'src/app/shared/service/source.service';
import { BrandFormService } from '../brand-form/brand-form.service';
import { ModelFormService } from '../model-form/model-form.service';
import { first } from 'rxjs/operators';
import { Seller } from 'src/app/shared/model/seller.model';
import { SellerService } from 'src/app/shared/service/seller.service';
import { LeadFup } from 'src/app/shared/model/lead-fup.model';
import { PersonService } from 'src/app/shared/service/person.service';
import { Person } from 'src/app/shared/model/person.model';
import { LeadFupService } from 'src/app/shared/service/lead-fup.service';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.css']
})
export class LeadFormComponent implements OnInit {
  isEdit = false;
  isFupEdit = false;
  isContactEmail = false;

  cols: any[];
  fupCols: any[];

  brandList: Brand[];
  brandSearch: Brand;
  brandRegister: Brand = new Brand();

  modelList: Model[] = Array<Model>();
  modelListSearch: Model[] = Array<Model>();

  statusList: Classifier[];
  sourceList: Source[];
  probabilityList: Classifier[];
  mediaList: Classifier[];

  leadList: Lead[];
  leadRegister: Lead;
  leadSearchFilter: Lead;

  sellerList: Seller[];
  sellerRegister: Seller = new Seller();

  fupList: LeadFup[];
  fupRegister: LeadFup;

  personList: Person[];

  @ViewChild('leadRegisterForm', { static: false }) leadRegisterForm: NgForm;
  @ViewChild('fupRegisterForm', { static: false }) fupRegisterForm: NgForm;
  @ViewChild('dt', { static: false }) dt: any;

  constructor(private brandService: BrandFormService,
              private modelService: ModelFormService,
              private confirmationService: ConfirmationService,
              private sourceService: SourceService,
              private messageService: MessageService,
              private leadService: LeadService,
              private classifierService: ClassifierService,
              private sellerService: SellerService,
              private personService: PersonService,
              private fupService: LeadFupService
  ) { }

  ngOnInit() {

    this.cols = [
      { field: 'status.label', header: 'Status' },
      { field: 'name', header: 'Nome' },
      { field: 'createDate', header: 'Data' },
      { field: 'model.brand.name', header: 'Marca' },
      { field: 'model.name', header: 'Modelo' },
      { field: 'phone', header: 'Celular' },
    ];

    this.fupCols = [
      { field: 'media', header: 'Ação' },
      { field: 'date', header: 'Data' },
      { field: 'person', header: 'Pessoa Contactada' },
      { field: 'comment', header: 'Detalhamento' },
    ];

    this.leadSearchFilter = new Lead();

    this.leadRegister = new Lead();
    this.brandSearch = null;
    this.brandRegister = new Brand();
    this.fupRegister = new LeadFup();

    this.leadList = new Array<Lead>();
    this.brandList = new Array<Brand>();
    this.modelList = new Array<Model>();
    this.sourceList = new Array<Source>();
    this.statusList = new Array<Classifier>();
    this.probabilityList = new Array<Classifier>();
    this.personList = new Array<Person>();
    this.fupList = new Array<LeadFup>();
    this.mediaList = new Array<Classifier>();

    this.loadBrandList();
    this.loadSourceList();
    this.loadStatusList();
    this.loadProbabilityList();
    this.loadSellerList();
    this.loadPersonList();
    this.loadMediaList();

    this.loadLead();
  }

  clearDropDown(event:any) {
    if(event.value == null ) {
      this.resetSearchForm()
    }
  }

  resetSearchForm() {
    this.loadLead();
    this.leadSearchFilter = new Lead();
    this.brandSearch = null;
  }

  loadBrandList() {
    var brandSearch: Brand = new Brand;

    if(this.brandSearch) {
      brandSearch = this.brandSearch;
    }

    brandSearch.active = true;
    this.brandService.search(brandSearch).pipe(first()).subscribe(data => {
      this.brandList = data ? data : [];
    });
  }

  changeBrandSearch(brand: Brand, targetList: Model[]) {
    this.loadModelList(brand, targetList);
  }

  changeBrand(brand: Brand, targetList: Model[]) {
    this.leadRegister.model = null;
    this.loadModelList(brand, targetList);
  }

  loadModelList(brand: Brand, targetList: Model[]) {
    this.leadSearchFilter.model = null;
    if(!brand) {
      targetList.splice(0, targetList.length);
      return;
    }

    this.modelService.getAllByBrand(brand.id).pipe(first()).subscribe(data => {
      targetList.splice(0, targetList.length);
      data.forEach(e => {
        if(this.leadRegister.id != null && this.leadRegister.model && this.leadRegister.model.id == e.id) {
          this.leadRegister.model = e;
        }
        targetList.push(e);
      });
    })
  }

  loadSourceList() {
    this.sourceService.getAll().pipe().subscribe(data => {
      this.sourceList = data ? data : []
    })
  }

  loadStatusList() {
    this.classifierService.searchByType("LEAD_STATUS").pipe().subscribe(data => {
      var sortedData = data.sort((s1, s2) => {
        if(s1.label > s2.label) {
          return 1;
        }
        if (s1.label < s2.label) {
          return -1;
        }

      return 0;
      });
      this.statusList = data ? sortedData : [];
    })
  }

  loadSellerList() {
    this.sellerService.getAll().pipe().subscribe(data => {
      this.sellerList = data ? data : [];
    })
  }

  loadProbabilityList() {
    this.classifierService.searchByType("LEAD_PROBABILITY").pipe().subscribe(data => {
      this.probabilityList = data ? data : [];
    })
  }

  loadMediaList() {
    this.classifierService.searchByType("MEDIA_CONTACT").pipe().subscribe(data => {
      this.mediaList = data ? data : [];
    })
  }

  loadPersonList() {
    this.personService.getAll().pipe().subscribe(data => {
      this.personList = data ? data : [];
    });
  }

  loadFupList() {
    if(this.leadRegister.id) {
      this.fupService.listByLead(this.leadRegister).pipe(first()).subscribe(data => {
        this.fupList  = data.map(fup => {
          return {
            ...fup,
            date: new Date(fup.date)
          }
        });
      }, error => {
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      })
    }
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.leadRegister = new Lead();
    this.leadRegisterForm.form.reset();
    this.modelList = new Array();

    this.resetFupRegisterForm();
  }

  save() {
    let method = this.leadRegister.id ? 'update' : 'save';
    let message = this.leadRegister.id ? 'atualizado' : 'adicionado';

    this.leadService[method](this.leadRegister).pipe().subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });

      if(method === 'save') {
        this.leadRegister.id = data.id;
        this.isEdit = true;
        this.resetFupRegisterForm();
      }

      if(method === 'update') {
        this.leadRegisterForm.reset();
        this.resetRegisterForm();
      }

      this.resetSearchForm();
    }, error => {
      if(error.includes('LEAD_STATUS')) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Troca de Status inválida' });
      } else {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      }
    });
  }

  loadLead() {
    this.leadService.getAll().pipe(first()).subscribe(data => {
      this.leadList  = data.map(lead => {
        return {
          ...lead,
          createDate: new Date(lead.createDate)
        }
      });
    }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    })
  }

  edit(event) {
    this.isEdit = true;
    this.leadService.getById(this.leadRegister.id).pipe(first()).subscribe(data => {
      this.leadRegister = data;
      this.leadRegister.createDate = new Date(this.leadRegister.createDate);
      this.brandRegister = data.model.brand;
      this.loadModelList(this.brandRegister, this.modelList);
      this.loadFupList();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  editFup(event) {
    this.isFupEdit = true;
  }

  remove(lead: Lead) {
    this.confirmationService.confirm({
      message: `Deseja remover o lead ${lead.email} ?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.leadService.delete
          (lead.id).pipe(first()).subscribe(data => {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
            this.leadRegisterForm.reset();
            this.resetSearchForm();
          }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
          });
      }
    })
  }

  search(event) {
    if (event && event.first) {
      this.leadSearchFilter.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.leadSearchFilter.first = 0;
    }

    const filterIsEmpty = Object.values(this.leadSearchFilter).every(x => x == null || x == '');

    if(filterIsEmpty) {
      this.loadLead();
    } else {
      this.leadService.search(this.leadSearchFilter).pipe(first()).subscribe(data => {
        this.leadList  = data.map(lead => {
          return {
            ...lead,
            createDate: new Date(lead.createDate)
          }
        });
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  saveFup() {
    let method = this.fupRegister.id ? 'update' : 'save';
    let message = this.fupRegister.id ? 'atualizado' : 'adicionado';

    this.fupRegister.leadId = this.leadRegister.id;

    this.fupService[method](this.fupRegister).pipe().subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });
      this.fupRegisterForm.reset();
      this.resetFupRegisterForm();
    }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  removeFup(fup: LeadFup) {

    this.confirmationService.confirm({
      message: `Deseja remover o Follow Up ${fup.person} ?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.fupService.delete
          (fup.id).pipe(first()).subscribe(data => {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
            this.fupRegisterForm.reset();
            this.resetFupRegisterForm();
          }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
          });
      }
    })


  }

  resetFupRegisterForm() {
    this.isFupEdit = false;
    this.fupRegister = new LeadFup();

    if(this.fupRegisterForm) {
      this.fupRegisterForm.form.reset();
    }
    this.loadFupList();
  }

}
