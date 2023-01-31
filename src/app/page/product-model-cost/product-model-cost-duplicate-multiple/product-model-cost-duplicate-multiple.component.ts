import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { ProductModelCost } from 'src/app/shared/model/product.model.cost';
import { ProductModelCostService } from '../service/product-model-cost.service';
import { Message, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-product-model-cost-duplicate-multiple',
  templateUrl: './product-model-cost-duplicate-multiple.component.html',
  styleUrls: ['./product-model-cost-duplicate-multiple.component.css']
})
export class ProductModelCostDuplicateMultipleComponent implements OnInit {

  action: string;
  adjustment: string;
  startDate: Date;
  endDate: Date;
  percentValue: number;
  percentValueShow: boolean;
  totalValue: number;
  totalValueShow: boolean;
  tabListDuplicateShow: boolean = false;

  productModelCostsOriginal: ProductModelCost[];
  productModelCosts: ProductModelCost[];

  msgs: Message[];

  @ViewChild('duplicateMultipleForm', {
    static: false
  }) duplicateMultipleForm: NgForm;

  // Variáveis Para O p-Table
  productModelCostFindDuplicateMultipleValue: ProductModelCost[];
  cols: any[];

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private datePipe: DatePipe,
              private messageService: MessageService,
              private productModelCostService: ProductModelCostService) { 

    this.productModelCostsOriginal = config.data;
  }

  ngOnInit() {

    this.cols = [
      { field: 'productModel.model.brand.name', header: 'Marca' },
      { field: 'productModel.model.name', header: 'Modelo' },
      { field: 'productModel.product.name', header: 'Produto' },
      { field: 'productModel.modelYearText', header: 'Faixa Ano Modelo' },
      { field: 'startDateEndDateText', header: 'Período' },
      { field: 'totalValue', header: 'Total' }
    ];

    this.percentValueShow = false;
  }

  cancel () {
    this.ref.close();
  }

  clickActionOrAdjustment () {

    this.totalValue = null;
    this.percentValue = null;
    
    if (this.action == "Ajustar") {

      if (this.adjustment == "Porcentagem") {

        this.totalValueShow = false;
        this.percentValueShow = true;

      } else {

        this.totalValueShow = true;
        this.percentValueShow = false;

      }

    } else {

      if (this.adjustment == "Porcentagem") {

        this.totalValueShow = true;
        this.percentValueShow = false;

        this.duplicateMultipleForm.form.patchValue({
          adjustment: "Monetário"
        });

      } else {
        
        this.totalValueShow = true;
        this.percentValueShow = false;
      }
    }
  }

  onInputTotalValue(totalValue) {

    this.totalValue = null;
    this.percentValue = null;

    if (this.action == "Ajustar") {

      if (this.adjustment == "Porcentagem") {

      } else {

        this.productModelCosts = this.productModelCostsOriginal;

        for (let productModelCost of this.productModelCosts) {
          productModelCost.totalValue = productModelCost.totalValue + totalValue;
        }
      }

    } else {

      if (this.adjustment == "Porcentagem") {
        
        this.productModelCosts = this.productModelCostsOriginal;

        for (let productModelCost of this.productModelCosts) {
          productModelCost.totalValue = totalValue;
        }
      } else {

        this.productModelCosts = this.productModelCostsOriginal;

        for (let productModelCost of this.productModelCosts) {
          productModelCost.totalValue = totalValue;
        }
      }
    }
  }

  onInputPercentValue(totalValue) {

    this.totalValue = null;
    this.percentValue = null;

    this.productModelCosts = this.productModelCostsOriginal;

    for (let productModelCost of this.productModelCosts) {

      var totalPercentValue = Number((productModelCost.totalValue / 100) * totalValue);
      productModelCost.totalValue = productModelCost.totalValue + totalPercentValue;
    }
  }

  save () {

    this.productModelCosts = this.productModelCostsOriginal;

    for (let productModelCost of this.productModelCosts) {
      productModelCost.id = null;
      productModelCost.startDate = this.startDate;
      productModelCost.endDate = this.endDate;
    }

    this.productModelCostFindDuplicateMultipleValue = new Array<ProductModelCost>();

    this.productModelCostService.findDuplicateMultipleValidate(this.productModelCosts).pipe(first()).subscribe(data => {
      this.productModelCostFindDuplicateMultipleValue = data.map(item => {
        
        item.startDateEndDateText = this.datePipe.transform(item.startDate, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(item.endDate, 'dd/MM/yyyy');
        item.productModel.modelYearText = 'DE ' + item.productModel.modelYearStart.toString() + ' ATÉ ' + item.productModel.modelYearEnd.toString()
        
        return {
          ...item
        }
      })

      if (this.productModelCostFindDuplicateMultipleValue != null && this.productModelCostFindDuplicateMultipleValue.length > 0) {
        this.tabListDuplicateShow = true;
        this.messageService.add({severity: 'error', summary: 'Erro', detail: `Já existe um relacionamento ou muitos com esse produto e modelo, dentro do mesmo range de ano/modelo e período, verifique a aba com a lista!`});
      } else {
        this.tabListDuplicateShow = false;
        this.messageService.clear();
        this.messageService.add({key: 'confirmDuplicateMultiple', sticky: true, severity:'warn', summary:'Deseja confirmar?', detail:'Passou no processo de validação, confirmar a inclusão?'});
      }

    }, error => {
      this.productModelCostFindDuplicateMultipleValue = null;
      this.ref.close(this.productModelCostFindDuplicateMultipleValue);
    });
  }

  onConfirm() {

    this.productModelCostService.saveBulk(this.productModelCosts).pipe(first()).subscribe(data => {

      this.duplicateMultipleForm.reset();
      this.ref.close(data);

    }, error => {
      this.productModelCosts = null;
      this.ref.close(this.productModelCosts);
    });
  }

  onReject() {
    this.messageService.clear('confirmDuplicateMultiple');
  }
}