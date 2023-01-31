import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { systemEnvironment } from '../environments/system-environment';
import { AboutComponent } from './portal/template/about/about.component';
import { Customer } from './shared/model/customer.model';
import { User } from './shared/model/user.model';
import { AuthenticationService } from './shared/service/authentication.service';
import { CustomerService } from './shared/service/customer.service';
import { MenuService } from './shared/service/menu.service';
import { UserService } from './shared/service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit {
  topbarMenuActive: boolean;
  topbarMenuConfigActive: boolean;
  overlayMenuActive: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuClick: boolean;
  topbarItemClick: boolean;
  resetMenu: boolean;
  menuHoverActive: boolean;
  userLogged: boolean = false;

  lightMenu = true;
  menuMode = 'static';
  topbarColor = 'layout-topbar-bluegrey';
  theme = 'blue-orange';
  language = 'pt_BR';

  msgs: Message[] = [];

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  userDefault: User;

  private currentCustomerSubject: BehaviorSubject<Customer>;
  public currentCustomer: Observable<Customer>;
  customerDefault: Customer;

  private currentUserConfigSubject: BehaviorSubject<any>;
  public currentUserConfig: Observable<any>;
  userConfig: any;

  userObs: Observable<User>;

  layoutMenuScroller: HTMLDivElement;

  displayNewModal: boolean;
  displayViewModal: boolean;

  constructor(private authService: AuthenticationService,
    private customerService: CustomerService,
    private menuService: MenuService,
    private userService: UserService,
    public dialogService: DialogService,
    private router: Router,
    private i18nConfig: PrimeNGConfig,
    private translateService: TranslateService
  ) {
    this.userObs = this.authService.currentUser;

    this.currentUserSubject = new BehaviorSubject<User>(this.userDefault);
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentCustomerSubject = new BehaviorSubject<Customer>(this.customerDefault);
    this.currentCustomer = this.currentCustomerSubject.asObservable();

    this.currentUserConfigSubject = new BehaviorSubject<any>(this.userConfig);
    this.currentUserConfig = this.currentUserConfigSubject.asObservable();
    
    // this.i18nConfig.setTranslation({

  }

  ngOnInit() {

    this.showVersion();
    
    this.translateService.setDefaultLang('pt_BR');
    this.translateService.use('pt_BR');
    this.translateService.get('primeng').subscribe(res => this.i18nConfig.setTranslation(res));
    
    this.msgs = [];
    this.changeTheme(this.theme);
    this.userObs.subscribe(data => {
      if (data != null) {
        this.userDefault = data;
        this.getUserData();
      }
    }, error => {
    });
  }

  getUserData() {
    if (this.userDefault != null) {
      this.userService.getById(this.userDefault.id).pipe(first()).subscribe(data => {
        this.userDefault = data;
        this.currentUserSubject.next(this.userDefault);
        if (this.userDefault != null) {
          this.userLogged = true;
          if (this.userDefault.config != null) {
            this.userConfig = JSON.parse(this.userDefault.config);
            if (this.userConfig != null) {
              this.currentUserConfigSubject.next(this.customerDefault);

              this.language = this.userConfig.language;
              this.lightMenu = this.userConfig.lightMenu;
              this.changeMenuMode(this.userConfig.menuStyle);
              this.changeTheme(this.userConfig.theme);
              this.topbarColor = this.userConfig.topColor;

              if (this.userConfig.customerDefault != null) {
                this.customerService.getById(this.userConfig.customerDefault).pipe(first()).subscribe(data => {
                  this.customerDefault = data;

                  if (this.customerDefault != null) {
                    this.userDefault.customer = this.customerDefault;
                    this.currentCustomerSubject.next(this.customerDefault);
                  }
                });
              }
            }
          }
        }
      }, error => {
        this.userLogged = false;
        this.logout();
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }

  public get getCurrentUser(): User {
    return this.currentUserSubject.getValue();
  }

  public get getCurrentCustomer(): Customer {
    return this.currentCustomerSubject.getValue();
  }

  public get getCurrentUserConfig(): any {
    return this.currentUserConfigSubject.getValue();
  }

  public setCurrentCustomer(customer: Customer) {
    this.customerDefault = customer;
    this.currentCustomerSubject.next(this.customerDefault);
  }

  changeTheme(theme: string) {
    const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
    layoutLink.href = 'assets/layout/css/layout-' + theme.split('-')[0] + '.css';
    const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
    themeLink.href = 'assets/theme/' + 'theme-' + theme + '.css';
  }

  onLayoutClick() {
    if (!this.topbarItemClick) {
      this.topbarMenuActive = false;
      this.topbarMenuConfigActive = false;
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isSlim()) {
        this.menuService.reset();
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
    }

    this.topbarItemClick = false;
    this.menuClick = false;
  }

  onMenuButtonClick(event) {
    this.menuClick = true;
    this.topbarMenuActive = false;

    if (this.isOverlay()) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }
    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuConfigActive = false;
    this.topbarMenuActive = !this.topbarMenuActive;
    this.hideOverlayMenu();
    event.preventDefault();
  }

  onTopbarMenuButtonClickConfig(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = false;
    this.topbarMenuConfigActive = !this.topbarMenuConfigActive;
    this.hideOverlayMenu();
    event.preventDefault();
  }

  onTopbarSubItemClick(event) {
    event.preventDefault();
  }

  isHorizontal() {
    return this.menuMode === 'horizontal';
  }

  isSlim() {
    return this.menuMode === 'slim';
  }

  isOverlay() {
    return this.menuMode === 'overlay';
  }

  isStatic() {
    return this.menuMode === 'static';
  }

  isMobile() {
    return window.innerWidth < 1025;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  hideOverlayMenu() {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  changeMenuMode(menuMode: string) {
    this.menuMode = menuMode;
    this.staticMenuDesktopInactive = false;
    this.overlayMenuActive = false;
  }

  navigateToRoute(route: string) {
    if (route.startsWith("http://") || route.startsWith("https://")) {
      window.open(route, "_blank");
    } else {
      this.topbarMenuActive = false;
      this.topbarMenuConfigActive = false;
      this.router.navigate([route]);
    }
  }

  showVersion() {
    console.log(`${systemEnvironment.systemName} - ${environment.environmentName} - v${systemEnvironment.versionNumber} - ${systemEnvironment.versionDate}`);
  }

  showModalDialogAbout() {
    this.dialogService.open(AboutComponent, {
      showHeader: false,
      width: '400px'
    });
  }

  logout() {
    this.authService.logout();
    this.currentUserSubject.next(null);
    this.currentCustomerSubject.next(null);
    this.currentUserConfigSubject.next(null);
    this.router.navigate(['/login']);
  }
}
