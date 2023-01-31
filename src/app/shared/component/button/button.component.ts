import { Component, Input, OnInit } from '@angular/core';
import * as _ from "lodash";

@Component({
  selector: 'wbp-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent implements OnInit {

  @Input() tooltip: string;
  @Input() disabled: boolean;

  constructor() { }

  ngOnInit() {
    // this.tooltip = 'updated text';
  }
}
