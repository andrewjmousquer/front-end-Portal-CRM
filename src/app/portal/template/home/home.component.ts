import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'wbp-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  items: MenuItem[];
  home: MenuItem;

  constructor() {
  }

  ngOnInit() {

  }

}
