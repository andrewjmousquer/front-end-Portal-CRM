import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../shared/service/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser: any = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
          // Language: 'pt'
        }
      });
    }

    return next.handle(request);
  }
}
