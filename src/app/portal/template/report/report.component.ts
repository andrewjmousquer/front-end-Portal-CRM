import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';

import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'wbp-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reportURL: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl("about:blank");

  constructor(public app: AppComponent, private route: ActivatedRoute, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.route.queryParams.
      subscribe(params => {
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.reportURL = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.jasper}/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&reportUnit=${params.path}&standAlone=true&decorate=no&pp=${user.token}`);
      });
  }
}
