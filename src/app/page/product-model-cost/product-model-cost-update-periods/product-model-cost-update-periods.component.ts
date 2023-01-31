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
  selector: 'app-product-model-cost-update-periods',
  templateUrl: './product-model-cost-update-periods.component.html',
  styleUrls: ['./product-model-cost-update-periods.component.css']
})
export class ProductModelCostUpdatePeriodsComponent implements OnInit {

  startDate: Date;
  endDate: Date;

  productModelCostsOriginal: ProductModelCost[];
  productModelCosts: ProductModelCost[];

  tabListDuplicateShow: boolean = false;

  @ViewChild('updatePeriodsForm', {
    static: false
  }) updatePeriodsForm: NgForm;

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
      { field: 'model.productModel.model.brand.name', header: 'Marca' },
      { field: 'model.productModel.model.name', header: 'Modelo' },
      { field: 'model.productModel.product.name', header: 'Produto' },
      { field: 'model.productModel.modelYearText', header: 'Faixa Ano Modelo' },
      { field: 'model.startDateEndDateText', header: 'Período' },
      { field: 'model.totalValue', header: 'Total' }
    ];

  }

  cancel () {
    this.ref.close(null);
  }

  save () {

    this.productModelCosts = this.productModelCostsOriginal;
    let countProductModelCosts = 0;

    for (let productModelCost of this.productModelCosts) {
      
      productModelCost.startDate = this.startDate;
      productModelCost.endDate = this.endDate;

      countProductModelCosts = 0;

      for (let productModelCostCompare of this.productModelCosts) {
        if (productModelCost.productModel.model.id == productModelCostCompare.productModel.model.id &&
            productModelCost.productModel.model.brand.id == productModelCostCompare.productModel.model.brand.id &&
            productModelCost.productModel.id == productModelCostCompare.productModel.id &&
            productModelCost.startDate == productModelCostCompare.startDate &&
            productModelCost.endDate == productModelCostCompare.endDate) {
          
          countProductModelCosts = countProductModelCosts + 1;

          if (countProductModelCosts >= 2) {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: `Você está tentando incluir um mesmo Custo por Modelo e Produto com o mesmo período, favor rever a seleção!`});  
            return;
          }
        }
      }
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
        this.messageService.add({key: 'confirmUpdatePeriods', sticky: true, severity:'warn', summary:'Deseja confirmar?', detail:'Passou no processo de validação, confirmar a inclusão?'});
      }

    }, error => {
      this.ref.close(null);
    });
  }

  onConfirm() {

    this.productModelCostService.updateBulk(this.productModelCosts).pipe(first()).subscribe(data => {

      this.updatePeriodsForm.reset();
      this.ref.close(this.productModelCosts);

    }, error => {
      this.ref.close(null);
    });
  }

  onReject() {
    this.messageService.clear('confirmUpdatePeriods');
  }
}