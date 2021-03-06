import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private userService: UserService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.cookieService.get(environment.auth.cookieTokenName);

    if (this.userService.expired()) {
      this.userService.login();
      return throwError('user token is expired');
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(request).pipe(catchError((error: any, caught: Observable<any>) => {
      if (error && error.status === 401) {
        this.cookieService.delete(environment.auth.cookieTokenName);
        this.userService.login();
      } else {
        return throwError(error);
      }
    }));
  }
}
