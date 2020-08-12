import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private userService: UserService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.userService.expired()) {
      this.userService.logout();
      return;
    }

    request = request.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${this.cookieService.get(environment.auth.cookieTokenName)}`,
      },
    });

    return next.handle(request).pipe(catchError((error: any, _caught: Observable<any>) => {
      if (error && error.status === 401) {
        this.userService.logout();
      } else {
        return throwError(error);
      }
    }));
  }
}
