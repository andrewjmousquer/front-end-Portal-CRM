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
  selector: 'app-product-model-cost-update-values',
  templateUrl: './product-model-cost-update-values.component.html',
  styleUrls: ['./product-model-cost-update-values.component.css']
})
export class ProductModelCostUpdateValuesComponent implements OnInit {

  action: string;
  adjustment: string;
  percentValue: number;
  percentValueShow: boolean;
  totalValue: number;
  totalValueShow: boolean;

  productModelCostsOriginal: ProductModelCost[];
  productModelCosts: ProductModelCost[];

  @ViewChild('updateValuesForm', {
    static: false
  }) updateValuesForm: NgForm;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private datePipe: DatePipe,
              private messageService: MessageService,
              private productModelCostService: ProductModelCostService) { 

    this.productModelCostsOriginal = config.data;
  }

  ngOnInit() {
    this.percentValueShow = false;
  }

  cancel () {
    this.ref.close(null);
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

        this.updateValuesForm.form.patchValue({
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

    this.productModelCostService.updateBulk(this.productModelCosts).pipe(first()).subscribe(data => {

      this.updateValuesForm.reset();
      this.ref.close(this.productModelCosts);
    }, error => {
      this.ref.close(null);
    });
  }
}