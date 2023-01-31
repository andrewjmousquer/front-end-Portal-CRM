import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AppComponent } from 'src/app/app.component';

import { MessageService } from 'primeng/api';

import { AuthenticationService } from 'src/app/shared/service/authentication.service';
import { SettingsFormService } from './settings-form.service';

import { MenuItem } from 'primeng/api/menuitem';
import { User } from 'src/app/shared/model/user.model';
import { Customer } from 'src/app/shared/model/customer.model';

@Component({
  selector: 'wbp-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {

  customerDefault: Customer;
  user: User;
  userObs: Observable<User>;
  userConfig: any;

  customerList: Customer[];
  topBars: any[];
  menuColors: any[];
  layouts: any[];
  themes: any[];
  languages: any[];

  items: MenuItem[];
  home: MenuItem;

  password: string;
  confirmPassword: string;

  constructor(public app: AppComponent,
    private authService: AuthenticationService,
    private settingsFormService: SettingsFormService,
    private messageService: MessageService) {
    this.userObs = this.app.currentUser;
  }

  ngOnInit(): void {

    this.userConfig = {};
    this.userConfig.theme = 'blue';
    this.userConfig.topColor = 'layout-topbar-grey';
    this.userConfig.lightMenu = false;
    this.userConfig.menuStyle = 'static';
    this.userConfig.language = 'pt_BR';

    this.userObs.subscribe(data => {
      this.user = data;
      if (this.user != null) {

        if (this.user.config != null) {
          this.userConfig = JSON.parse(this.user.config);
          if (this.userConfig != null) {
            this.changeLanguage(this.userConfig.language);
            this.changeMenuColor(this.userConfig.lightMenu);
            this.changeMenuStyle(this.userConfig.menuStyle);
            this.changeTheme(this.userConfig.theme);
            this.changeTopbarColor(this.userConfig.topColor);
          }
        }

        if (this.user.customers != null) {
          if (this.user.customers.length > 0) {
            this.customerList = this.user.customers;
          }
        }
      }
    });

    this.topBars = [
      { label: 'Blue', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-bluegrey' },
      { label: 'Cyan', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-cyan' },
      { label: 'Dark', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-dark' },
      { label: 'Green', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-green' },
      { label: 'Grey', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-grey' },
      { label: 'Light', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-light' },
      { label: 'Lime', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-lime' },
      { label: 'Pink', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-pink' },
      { label: 'Purple', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-purple' },
      { label: 'Teal', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-teal' },
      { label: 'Yellow', icon: 'fa fa-fw fa-paint-brush', class: 'layout-topbar-yellow' }
    ];

    this.menuColors = [
      { label: 'Dark', icon: 'fa fa-fw fa-circle', light: false },
      { label: 'Light', icon: 'fa fa-fw fa-circle-o', light: true }
    ];

    this.layouts = [
      { label: 'Horizontal', icon: 'fa fa-fw fa-bars', menuMode: 'horizontal' },
      { label: 'Overlay', icon: 'fa fa-fw fa-bars', menuMode: 'overlay' },
      { label: 'Slim', icon: 'fa fa-fw fa-bars', menuMode: 'slim' },
      { label: 'Static', icon: 'fa fa-fw fa-bars', menuMode: 'static' }
    ];

    this.themes = [
      { label: 'Amber Teal', icon: 'fa fa-fw fa-paint-brush', tema: 'amber-teal' },
      { label: 'Blue Orange', icon: 'fa fa-fw fa-paint-brush', tema: 'blue-orange' },
      { label: 'Blue Grey Teal', icon: 'fa fa-fw fa-paint-brush', tema: 'bluegrey-teal' }, // add
      { label: 'Brown Cyan', icon: 'fa fa-fw fa-paint-brush', tema: 'brown-cyan' },
      { label: 'Cyan Amber', icon: 'fa fa-fw fa-paint-brush', tema: 'cyan-amber' },
      { label: 'Deep-Orange Blue', icon: 'fa fa-fw fa-paint-brush', tema: 'deeporange-blue' },
      { label: 'Green Yellow', icon: 'fa fa-fw fa-paint-brush', tema: 'green-yellow' },
      { label: 'Indigo Yellow', icon: 'fa fa-fw fa-paint-brush', tema: 'indigo-yellow' },
      { label: 'Lime Purple', icon: 'fa fa-fw fa-paint-brush', tema: 'lime-purple' },
      { label: 'Purple Blue', icon: 'fa fa-fw fa-paint-brush', tema: 'purple-blue' }
      // { label: 'Blue Orange', icon: 'fa fa-fw fa-paint-brush', tema: 'blue-orange' },
      // { label: 'Grey Teal', icon: 'fa fa-fw fa-paint-brush', tema: 'grey-teal' },
    ];

    this.languages = [
      { label: 'Espanhol', image: 'assets/layout/images/i18n/espanhol.png', language: 'es_ES' },
      { label: 'Inglês', image: 'assets/layout/images/i18n/english.png', language: 'en_US' },
      { label: 'Portugues', image: 'assets/layout/images/i18n/portuguese.png', language: 'pt_BR' }
    ];
  }

  changeDefaultCustomer(customer: Customer) {
    this.customerDefault = customer;
  }

  changeTheme(theme: string) {
    const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
    layoutLink.href = 'assets/layout/css/layout-' + theme.split('-')[0] + '.css';
    const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
    themeLink.href = 'assets/theme/' + 'theme-' + theme + '.css';
    this.userConfig.theme = theme;
  }

  changeTopbarColor(topColor) {
    this.app.topbarColor = topColor;
    this.userConfig.topColor = topColor;
  }

  changeMenuColor(light) {
    this.app.lightMenu = light;
    this.userConfig.lightMenu = light;
  }

  changeMenuStyle(menuStyle) {
    this.app.changeMenuMode(menuStyle);
    this.userConfig.menuStyle = menuStyle;
  }
  changeLanguage(language) {
    this.userConfig.language = language;
  }

  saveUserConfig() {
    if (this.customerDefault != null) {
      this.userConfig.customerDefault = this.customerDefault.id;
      this.app.setCurrentCustomer(this.customerDefault);
    }

    if (this.password) {
      if (this.password == "" || this.password == undefined || this.password == null ||
        this.confirmPassword == "" || this.confirmPassword == undefined || this.confirmPassword == null) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'Preencha os campos de senha com valores válidos' });
        return;
      } else if (this.password != this.confirmPassword) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: 'As senhas devem ser iguais' });
        return;
      }

      this.user.password = this.password;
    }

    this.user.config = JSON.stringify(this.userConfig);

    this.settingsFormService.saveUserConfig(this.user).pipe(first()).subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro adicionado com sucesso!` });
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

}
