import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { AuthenticationService } from '../../../shared/service/authentication.service';
import { ReportService } from '../report/report.service';
import { Observable } from 'rxjs';

import { Menu } from 'src/app/shared/model/menu.model';
import { User } from '../../../shared/model/user.model';

import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Report } from 'src/app/shared/model/report.model';

@Component({
  selector: 'wbp-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {

  userObs: Observable<User>;

  user: User;

  menuList: Menu[];

  constructor(public app: AppComponent, private authService: AuthenticationService, private reportService: ReportService, private messageService: MessageService) {
    this.userObs = this.app.currentUser;
  }

  ngOnInit() {
    this.user = new User();
    this.userObs.subscribe(data => {
      this.user = data;
      if (this.user != null) {
        if (this.user.accessList != null) {
          this.menuList = this.user.accessList.menus;
          this.includeReportsMenu();
        }
      }
    });
  }

  onMenuClick(event) {
    if (!this.app.isHorizontal()) {
    }
    this.app.onMenuClick(event);
  }

  private includeReportsMenu() {
    if (this.menuList) {
      if (this.menuList.filter((menu: Menu) => { return menu.type.value == "PORTAL_RELATORIO"; }).length > 0) {
        this.reportService.getAll().pipe(first()).subscribe(data => {
          if (data.length > 0) {
            this.includeReportsFolder(data);
          }
        }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
      }
    }
  }

  private includeReportsFolder(reports) {
    this.menuList.find((menu: Menu) => { return menu.type.value == "PORTAL_RELATORIO"; }).submenus = [];
    this.reportService.getAllFolders().pipe(first()).subscribe(folders => {
      reports.forEach(report => {
        let foldersStr = report.uri.split("/");
        foldersStr = foldersStr.slice(1);
        let index = 0;
        let lastFolder = new Menu();
        let lastUri = "";
        foldersStr.forEach(folderStr => {
          lastUri += `/${folderStr}`;
          let submenusReportFiltered = [];
          if (lastFolder.submenus) {
            submenusReportFiltered = lastFolder.submenus.filter((submenuReport: Menu) => { return submenuReport.routeReport == lastUri; });
          } else {
            submenusReportFiltered = this.menuList.find((menu: Menu) => { return menu.type.value == "PORTAL_RELATORIO"; }).submenus.filter((submenuReport: Menu) => { return submenuReport.routeReport == lastUri; });
          }
          if (submenusReportFiltered.length == 0) {
            if ((foldersStr.length - 1) == index) {
              let menu = new Menu();
              menu.name = report.label;
              menu.description = report.description;
              menu.route = `/reports`;
              menu.show = true;
              menu.routeReport = report.uri;
              menu.icon = `fa fa-fw fa-file-text-o`;
              let classifier = new Classifier();
              classifier.type = `MENU_TYPE`;
              classifier.value = `PORTAL_RELATORIO`;
              menu.type = classifier;
              lastFolder.submenus = (lastFolder.submenus ? lastFolder.submenus : []);
              lastFolder.submenus.push(menu);
            } else {
              let menu = new Menu();
              menu.name = folders.filter((folderReport: Report) => { return folderReport.uri == lastUri; })[0].label;
              menu.icon = `fa fa-fw fa-folder-o`;
              menu.routeReport = lastUri;
              menu.show = true;
              let classifier = new Classifier();
              classifier.type = `MENU_TYPE`;
              classifier.value = `PORTAL_RELATORIO`;
              menu.type = classifier;
              if (Object.keys(lastFolder).length !== 0) {
                lastFolder.submenus = (lastFolder.submenus ? lastFolder.submenus : []);
                lastFolder.submenus.push(menu);
              } else {
                this.menuList.find((menu: Menu) => { return menu.type.value == "PORTAL_RELATORIO"; }).submenus.push(menu);
              }
              lastFolder = menu;
            }
          } else {
            lastFolder = submenusReportFiltered[0];
          }
          index++;
        });
      });
    });
  }
}
