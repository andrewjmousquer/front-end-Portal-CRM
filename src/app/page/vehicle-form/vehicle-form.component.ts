import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { StatusProposalDictionary } from 'src/app/shared/dictionary/status-proposal.dictionary';
import { ProposalDTO } from 'src/app/shared/dto/proposal/proposal.dto';
import { ClassifierEnum } from 'src/app/shared/enum/classifier-enum';
import { Brand } from 'src/app/shared/model/brand.model';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Model } from 'src/app/shared/model/model.model';
import { Proposal } from 'src/app/shared/model/proposal';
import { StatusProposal } from 'src/app/shared/model/status-proposal';
import { Vehicle } from 'src/app/shared/model/vehicle.model';
import { ClassifierService } from 'src/app/shared/service/classifier.service';
import { ProposalService } from 'src/app/shared/service/proposal.service';
import { UserUtil } from 'src/app/shared/util/user.util';
import { Utils } from 'src/app/shared/util/util';
import { BrandFormService } from '../brand-form/brand-form.service';
import { ModelFormService } from '../model-form/model-form.service';
import { VehicleService } from './vehicle-form.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  isEdit = false;
  cols: any[];
  colsProposal: any[];

  vehicleList: Vehicle[];
  brandList: Brand[];
  modelList: Model[] = Array<Model>();

  colorList: Classifier[];

  searchModel: string;

  brandSearch: Brand = new Brand();
  proposal: Proposal = new Proposal();
  vehicleRegister: Vehicle = new Vehicle();
  brandRegister: Brand = new Brand();
  modelRegister: Model = new Model();

  statusProposalList: StatusProposal[] = new Array<StatusProposal>();

  userUtil: any = UserUtil;

  register: ProposalDTO = new ProposalDTO();
  displayModal: boolean;

  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('vehicleRegisterForm', {
    static: false
  }) vehicleRegisterForm: NgForm;
  @Output() onComplete: EventEmitter<Proposal> = new EventEmitter();
  @Output() getProposalInitCustom: EventEmitter<Proposal> = new EventEmitter();

  constructor(
    private messageService: MessageService,
    private vehicleService: VehicleService,
    private brandService: BrandFormService,
    private modelService: ModelFormService,
    private confirmationService: ConfirmationService,
    private proposalService: ProposalService,
    private classifierService: ClassifierService,
    private router: Router) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'model.brand.name', header: 'Marca' },
      { field: 'model.name', header: 'Modelo' },
      { field: 'plate', header: 'Placa' },
      { field: 'color.label', header: 'Cor' }
    ];


    this.colsProposal = [
      { field: 'status', header: 'Status' },
      { field: 'client', header: 'Cliente' },
      { field: 'num', header: 'Proposta' },
      { field: '', header: 'Pedido' },
      { field: 'partner', header: 'Parceiro' },
      { field: '', header: 'Executivo de Negócio' },
      { field: 'brandModel', header: 'Marca | Modelo' },
      { field: 'createDate', header: 'Data Criação' },
      { field: 'totalPrice', header: 'Valor Total' }
    ];

    this.statusProposalList = StatusProposalDictionary;

    this.vehicleList = new Array<Vehicle>();
    this.brandList = new Array<Brand>();
    this.brandSearch = new Brand();
    this.colorList = new Array<Classifier>();
    this.loadBrandList();
    this.loadColorList();
    this.resetSearchForm();
  }

  resetSearchForm() {
    this.loadVehicle();
    this.brandSearch = new Brand();
  }

  loadModelList() {
    this.modelService.getAllByBrand(this.brandRegister.id).pipe(first()).subscribe(data => {
      this.modelList = data ? data : [];

      if(this.vehicleRegister.model){
        this.modelRegister = this.vehicleRegister.model;
      }
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  loadColorList(){
    this.classifierService.searchByType(ClassifierEnum.VEHICLE_COLOR).pipe(first()).subscribe(data => {
      this.colorList = data;
      this.colorList.sort((a, b) => (a.label < b.label ? -1 : 1));
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  changeBrand() {
    this.vehicleRegister.model = null;
    this.loadModelList();
  }

  loadBrandList() {
    this.brandSearch.active = true;
    this.brandService.search(this.brandSearch).pipe(first()).subscribe(data => {
      this.brandList = data ? data : [];
      this.brandList.sort((b1, b2) =>  b1.name.localeCompare(b2.name));
    });
  }

  loadVehicle() {
    this.vehicleService.getAll().pipe(first()).subscribe(data => {
      this.vehicleList = data.map(item => {
        return {
          ...item,
          purchaseDate: null
        }
      });
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  save() {
    let method = this.vehicleRegister.id ? 'update' : 'save';
    let message = this.vehicleRegister.id ? 'atualizado' : 'adicionado';

    this.vehicleRegister.model = this.modelRegister;

    this.vehicleService[method](this.vehicleRegister).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });
      this.vehicleRegisterForm.reset();
      this.resetRegisterForm();
      this.resetSearchForm();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  edit(event) {
    this.isEdit = true;
    this.vehicleService.getById(this.vehicleRegister.id).pipe(first()).subscribe(data => {
      if(data && data.purchaseDate){
        data.purchaseDate = Utils.normalizeDate(this.vehicleRegister.purchaseDate);
      }
      this.vehicleRegister = data;
      this.brandRegister = data.model.brand;
      this.loadModelList();
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  resetRegisterForm() {
    this.isEdit = false;
    this.modelRegister = new Model();
    this.vehicleRegister = new Vehicle();
    this.vehicleRegisterForm.form.reset();
  }

  search(event) {
    if (event && event.first) {
      this.brandSearch.first = event.first
    } else {
      if (this.dt) this.dt._first = 0;
      this.brandSearch.first = 0;
    }

    let method = this.brandSearch.name == null || this.brandSearch.name == "" ? 'getAll' : 'search';
    let variable = this.brandSearch.name == null ? new Vehicle() : this.brandSearch.name;
    this.vehicleService[method](variable).pipe(first()).subscribe(data => {
      this.vehicleList = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  remove(vehicle: Vehicle) {
    this.confirmationService.confirm({
      message: `Deseja remover ${vehicle.model.brand.name} ${vehicle.model.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.vehicleService.delete
          (vehicle.id).pipe(first()).subscribe(data => {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
            this.resetSearchForm();
            this.vehicleRegisterForm.reset();
            this.loadVehicle();
          }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
          });
      }
    })
  }

  validPlate(vehicle: any) {
    if (vehicle && vehicle.length == 7) {
      this.vehicleService.search(vehicle).pipe(first()).subscribe(data => {
        if (data.length > 0 && data[0].id != this.vehicleRegister.id) {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Já existe um veículo cadastrado com essa placa.' });
        }
      });
    }
  }

  validChassi(vehicle: any) {
    this.vehicleService.search(vehicle).pipe(first()).subscribe(data => {
      if (data.length > 0 && data[0].id != this.vehicleRegister.id) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Já existe um veículo cadastrado com esse chassi.' });
      }
    });
  }

  getProposalStatusName(statusId) {
    return this.statusProposalList.find(s => s.id === statusId).name;
  }

  getProposalStatusColor(statusId) {
    let styles = {};
    styles['background-color'] = this.statusProposalList.find(s => s.id === statusId).color
    return styles;
  }
  getValidityDateColor(validityDays: number, statusId: number) {
    let styles = {};
    // apenas propostas Em Andamento ou Em Aprovação Comercial
    if (statusId == 61 || statusId == 62) {
      if (validityDays >= 10)
        styles['color'] = '#8439e3';
      else if (validityDays < 10 && validityDays >= 7)
        styles['color'] = '#faa606';
      else if (validityDays < 7)
        styles['color'] = '#c3393c';
    }

    return styles;
  }

  openModal(proposal: Proposal) {
    this.proposalService.getProposal(proposal.id).pipe(first()).subscribe(data => {
      this.register = data;
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
    this.displayModal = true;
  }
}
