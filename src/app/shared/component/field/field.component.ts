import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'wbp-field',
  templateUrl: './field.component.html'
})
export class FieldComponent implements OnInit {

  old: any;

  @Input() model: any;
  @Input() label: string;
  @Input() name: string;
  @Input() required: boolean;
  @Input() type: string = 'dropdown';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() classField: string;
  @Input() placeholder: string;

  // dropdown
  @Input() filter: boolean = true;
  @Input() showFilterOn: number = 7;
  @Input() dataKey: string = 'id';
  @Input() optionLabel: string = 'name';
  @Input() options: any[] = [];
  @Input() autoDisplayFirst: boolean = false;
  @Input() showClear: boolean = false;
  @Input() optionDisabled: boolean = false;

  // multiselect
  @Input() showHeader: boolean = true;

  // text
  @Input() pattern: string;
  @Input() maxlength: number;
  @Input() addonLeft: string;
  @Input() addonRight: string;

  // decimal
  @Input() minFractionDigits: number = 2;
  @Input() maxFractionDigits: number = 2;
  @Input() min: number;
  @Input() max: number;

  @Input() defaultValue: number;

  // calendar
  @Input() showButtonBar: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() monthNavigator: boolean = true;
  @Input() yearNavigator: boolean = true;
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() yearRange: string = '2000:2100';
  @Input() minDate: Date;
  @Input() maxDate: Date;

  // checkbox
  @Input() binary: boolean = true;

  // mask
  @Input() mask: string;
  @Input() unmask: boolean = true;

  @Input() keyFilter: RegExp;

  // events
  @Output() modelChange = new EventEmitter<any>();

  @Output() onComplete = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();

  _: any = _;
  input: any;

  constructor() { }

  ngOnInit() {
    this.defaultValue = this.defaultValue || (this.type == 'decimal' ? 0 : null);
  }

  ngOnChanges(): void {
    let select = this.type == 'dropdown' || this.type == 'multiSelect';

    if (this.type == 'multiSelect' && !this.model) {
      this.model = [];
    }

    if (this.type == 'calendar' && this.model) {
      this.model = new Date(this.model);
    }

    if (!this.placeholder) {
      this.placeholder = '';
    }

    if (select && this.options && this.model) {
      if (this.type == 'multiSelect') {
        this.model.map(model => {
          this.buildOptions(model);
        });
      } else {
        this.buildOptions(this.model);
      }
    }
  }

  buildOptions(model: any) {
    let search = this.options.filter(o => {
      return o[this.dataKey] == model[this.dataKey]
    });
    if (!search.length && Object.keys(model).length && model[this.optionLabel]) {
      this.options.push(model);
      this.orderList();
    }
  }

  onModelChange() {
    if (this.type == 'mask') {
      setTimeout(() => {
        this.modelChange.emit(this.model);
      }, 200);
    } else {
      this.modelChange.emit(this.model);
    }
  }

  onModelComplete() {
    switch (this.type) {
      case 'mask':
        if (!this.old) {
          this.old = this.model;
          setTimeout(() => {
            this.onComplete && this.onComplete.emit(this.model);
          }, 200);
        } else {
          this.old = null;
        }
        break;
    }
  }

  onModelKeydown($event) {
    // console.log('keydown', $event, this.model);
  }

  onModelClear($event) {
    console.log('onModelClean', $event, this.model);
  }

  onBlurDecimal() {
    if (this.model) {
      this.onBlur && this.onBlur.emit(this.model);
    } else {
      this.validValueDefault();
    }
  }

  validValueDefault() {
    if (this.defaultValue !== null && !this.model) {
      setTimeout(() => {
        this.model = this.defaultValue;
        this.modelChange.emit(this.model);
        this.onBlur && this.onBlur.emit(this.model);
      }, 200);
    } else {
      this.onBlur && this.onBlur.emit(this.model);
    }
  }

  orderList() {
    this.options = _.orderBy(this.options, [this.optionLabel], ['asc']);
  }
}
