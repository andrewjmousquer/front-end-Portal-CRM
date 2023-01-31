import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';

import { Observable } from 'rxjs';
import { User } from 'src/app/shared/model/user.model';
import { Menu } from 'src/app/shared/model/menu.model';
import { Customer } from 'src/app/shared/model/customer.model';
import { ReportService } from '../report/report.service';
import { first } from 'rxjs/operators';
import { Classifier } from 'src/app/shared/model/classifier.model';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'wbp-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  userObs: Observable<User>;
  customerObs: Observable<Customer>;
  menuList: Menu[];

  user: User;
  customer: Customer;
  userConfig: any;
  showConfigMenu: boolean = false;

  constructor(private app: AppComponent,
    private reportService: ReportService) {
    this.userObs = this.app.currentUser;
    this.customerObs = this.app.currentCustomer;
  }

  ngOnInit() {
    this.user = new User();
    this.customer = new Customer();
    this.userObs.subscribe(data => {
      this.user = data;
      this.showConfigMenu = false;

      if (this.user != null) {
        if (this.user.accessList != null) {
          this.menuList = this.user.accessList.menus;
          if (this.menuList != null && this.menuList.length > 0) {
            this.menuList.forEach(obj => {
              if (obj.type.value == "PORTAL_CONFIG") {
                this.showConfigMenu = true;
                return;
              }
            });
            this.insertJasperMenu();
          }
        }
      }
    });

    this.customerObs.subscribe(data => {
      this.customer = data;
    });
  }

  insertJasperMenu() {
    this.reportService.check().pipe(first()).subscribe(data => {
      if (data) {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let jasperMenuConfig = new Menu();
        jasperMenuConfig.icon = `fa fa-fw fa-file-text-o`;
        jasperMenuConfig.name = `Servidor de Relatórios`;
        jasperMenuConfig.description = `Servidor de Relatórios`;
        jasperMenuConfig.route = `${environment.jasper}?pp=${user.token}`;
        let classifier = new Classifier();
        classifier.type = `MENU_TYPE`;
        classifier.value = `PORTAL_CONFIG`;
        jasperMenuConfig.type = classifier;
        this.menuList.push(jasperMenuConfig);
      }
    });
  }

  onLogout() {
    this.app.logout();
  }

}

