import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItemService } from './menu.service';
import { AppComponent } from '../../../app.component';

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-menuitem]',
  /* tslint:enable:component-selector */
  template: `
        <ng-container *ngIf="(item.show) &&(item.type.value == 'PORTAL_PRODUCT' || item.type.value == 'PORTAL_RELATORIO')
            && ((item.icon != null ? item.icon.indexOf('fa') !== -1 : true))">
            <a [attr.href]="item.url" (click)="itemClick($event)" *ngIf="!item.route || item.submenus"
               (mouseenter)="onMouseEnter()" (keydown.enter)="itemClick($event)"
               [attr.target]="item.target" [attr.tabindex]="0" [ngClass]="item.styleClass">
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{item.name}}</span>
                <i class="fa fa-fw fa-angle-down layout-submenu-toggler" *ngIf="item.submenus"></i>
                <span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
            </a>
            <a (click)="itemClick($event)" (mouseenter)="onMouseEnter()" *ngIf="item.route && !item.submenus"
               [routerLink]="item.route" [queryParams]="{path: item.routeReport}" routerLinkActive="active-menuitem-routerlink" [ngClass]="item.styleClass"
               [routerLinkActiveOptions]="{exact: true}" [attr.target]="item.target" [attr.tabindex]="0">
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{item.name}}</span>
                <i class="fa fa-fw fa-angle-down layout-submenu-toggler" *ngIf="item.submenus"></i>
                <span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
            </a>
            <div class="layout-menu-tooltip">
                <div class="layout-menu-tooltip-arrow"></div>
                <div class="layout-menu-tooltip-text">{{item.name}}</div>
            </div>
            <ul *ngIf="item.submenus && active"
                [@children]="((app.isHorizontal() || app.isSlim()) && root) ? (active ? 'visible' : 'hidden') :
                (active ? 'visibleAnimated' : 'hiddenAnimated')">
                <ng-template ngFor let-child let-i="index" [ngForOf]="item.submenus">
                    <li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass"></li>
                </ng-template>
            </ul>
        </ng-container>
    `,

  host: {
    '[class.active-menuitem]': 'active'
  },
  animations: [
    trigger('children', [
      state('void', style({
        height: '0px'
      })),
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        height: '*',
        'z-index': 100
      })),
      state('hidden', style({
        height: '0px',
        'z-index': '*'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class MenuitemComponent implements OnInit, OnDestroy {

  @Input() item: any;
  @Input() index: number;
  @Input() root: boolean;
  @Input() parentKey: string;

  active = false;

  menuSourceSubscription: Subscription;
  menuResetSubscription: Subscription;

  key: string;

  constructor(public app: AppComponent, public router: Router, private cd: ChangeDetectorRef, private menuService: MenuItemService) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe(key => {
      // deactivate current active menu
      if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
        this.active = false;
      }
    });

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.app.menuHoverActive = false;
      this.active = false;
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(params => {
        if (this.app.isHorizontal() || this.app.isSlim()) {
          this.active = false;
        } else {
          if (this.item.route) {
            this.updateActiveStateFromRoute();
          } 
        }
      });
  }

  ngOnInit() {
    if (!(this.app.isHorizontal() || this.app.isSlim()) && this.item.route) {
      //this.updateActiveStateFromRoute();
    }

    this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
  }

  updateActiveStateFromRoute() {
    this.active = this.router.isActive(this.item.route[0], this.item.submenus ? false : true);
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return true;
    }

    // navigate with hover in horizontal mode
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    // notify other items
    this.menuService.onMenuStateChange(this.key);

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.submenus) {
      this.active = !this.active;
    } else {
      // activate item
      this.active = true;

      // reset horizontal menu
      if (this.app.isHorizontal() || this.app.isSlim()) {
        this.menuService.reset();
      }
    }

    this.app.topbarMenuActive = false;
    this.app.topbarMenuConfigActive = false;
  }

  onMouseEnter() {
    // activate item on hover
    if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim()) && this.app.isDesktop()) {
      this.menuService.onMenuStateChange(this.key);
      this.active = true;
    }
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
}
