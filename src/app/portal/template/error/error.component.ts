import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppComponent } from '../../../app.component';

@Component({
  selector: 'wbp-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(
    public app: AppComponent, private route: ActivatedRoute) {
  }

  errorCode: number;

  ngOnInit() {
    this.route.queryParams.
      subscribe(params => {
        this.errorCode = params.c;
      });
  }
}
