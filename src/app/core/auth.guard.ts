import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Menu } from '../shared/model/menu.model';

import { AuthenticationService } from '../shared/service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  private byPassUrl = [
    "settings-form"
  ];

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      if (currentUser.token) {
        if (currentUser.token != '') {
          let filteredByPassURL = this.byPassUrl.filter(bUrl => {
            return bUrl == route.routeConfig.path
          })[0];

          if (filteredByPassURL) {
            return true;
          }
          
          let permittedRoute = false;
          
          for (const menu of currentUser.accessList.menus) {
            if (menu.submenus && menu.submenus.length > 0) {
              for (const submenu of menu.submenus) {
                if(submenu.route == route.routeConfig.path.split('/')[0]){
                  permittedRoute = true;
                  break;
                }
              };
            } else {
              if(menu.route == route.routeConfig.path.split('/')[0]){
                permittedRoute = true;
                break;
              }
            }
          }

          if (permittedRoute) {
            return true;
          } else {
            this.router.navigate(['/error'], { queryParams: { c: 403 } });
            return false;
          }
        }
      }
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
