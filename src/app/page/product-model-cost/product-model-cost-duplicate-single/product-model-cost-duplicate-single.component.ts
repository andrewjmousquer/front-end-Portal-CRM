import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { ProductModelCost } from 'src/app/shared/model/product.model.cost';
import { ProductModelCostService } from '../service/product-model-cost.service';

@Component({
  selector: 'app-product-model-cost-duplicate-single',
  templateUrl: './product-model-cost-duplicate-single.component.html',
  styleUrls: ['./product-model-cost-duplicate-single.component.css']
})
export class ProductModelCostDuplicateSingleComponent implements OnInit {

  action: string;
  adjustment: string;
  startDate: Date;
  endDate: Date;
  percentValue: number;
  percentValueShow: boolean;
  totalValue: number;
  totalValueShow: boolean;
  totalValueOriginal: number;
  totalValueNew: number;

  productModelCost: ProductModelCost;

  @ViewChild('duplicateSingleForm', {
    static: false
  }) duplicateSingleForm: NgForm;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private productModelCostService: ProductModelCostService) { 

    this.productModelCost = config.data;

    this.totalValueOriginal = this.productModelCost.totalValue;

    this.startDate = new Date();
    var startDate1Day = moment(this.productModelCost.endDate).add(1, 'days').toDate(); 
    this.startDate = startDate1Day;
  }

  ngOnInit() {
    this.percentValueShow = false;
  }

  cancel () {
    this.ref.close();
  }

  save () {

    this.productModelCost.id = null;
    this.productModelCost.startDate = this.startDate;
    this.productModelCost.endDate = this.endDate;
    this.productModelCost.totalValue = this.totalValueNew;

    this.productModelCostService.save(this.productModelCost).pipe(first()).subscribe(data => {
      this.duplicateSingleForm.reset();
      this.ref.close(this.productModelCost);
    }, error => {
      this.productModelCost = null;
      this.ref.close(this.productModelCost);
    });
  }

  clickActionOrAdjustment () {

    this.totalValue = null;
    this.totalValueNew = null;
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

        this.duplicateSingleForm.form.patchValue({
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
    this.totalValueNew = null;
    this.percentValue = null;

    if (this.action == "Ajustar") {

      if (this.adjustment == "Porcentagem") {

      } else {
        this.totalValueNew = this.totalValueOriginal + totalValue;
      }

    } else {

      if (this.adjustment == "Porcentagem") {
        this.totalValueNew = totalValue;
      } else {
        this.totalValueNew = totalValue;
      }
    }
  }

  onInputPercentValue(totalValue) {

    this.totalValue = null;
    this.totalValueNew = null;
    this.percentValue = null;

    var totalPercentValue = Number((this.totalValueOriginal / 100) * totalValue);
    this.totalValueNew = this.totalValueOriginal + totalPercentValue;
  }
}