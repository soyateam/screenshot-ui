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
    // const token = this.cookieService.get(environment.auth.cookieTokenName);

    // if (!token || this.userService.expired()) {
    //   this.userService.login();
    //   return;
    // }

    request = request.clone({
      setHeaders: {
        // tslint:disable-next-line: max-line-length
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InQyMzQ1ODc4OUBqZWxsby5jb20iLCJhZGZzSWQiOiJ0MjM0NTg3ODlAamVsbG8uY29tIiwiZ2VuZXNpc0lkIjoiNWU1Njg4MzI0MjAzZmM0MDA0MzU5MWFhIiwibmFtZSI6eyJmaXJzdE5hbWUiOiLXoNeZ15nXp9eZIiwibGFzdE5hbWUiOiLXkNeT15nXk9ehIn0sImRpc3BsYXlOYW1lIjoidDIzNDU4Nzg5QGplbGxvLmNvbSIsInByb3ZpZGVyIjoiR2VuZXNpcyIsImVudGl0eVR5cGUiOiJkaWdpbW9uIiwiY3VycmVudFVuaXQiOiJuaXRybyB1bml0IiwiZGlzY2hhcmdlRGF5IjoiMjAyMi0xMS0zMFQyMjowMDowMC4wMDBaIiwicmFuayI6Im1lZ2EiLCJqb2IiOiLXqNeV16bXlyIsInBob25lTnVtYmVycyI6WyIwNTItMTIzNDU2NyJdLCJhZGRyZXNzIjoi16jXl9eV15Eg15TXntee16rXp9eZ150gMzQiLCJwaG90byI6bnVsbCwianRpIjoiN2ZmMTgyZTEtZmM1YS00NjdjLWE2MDAtZDkwMjIyMzEwNTJhIiwiaWF0IjoxNTk4MzM5Mzg0LCJleHAiOjE2MDA5MzEzODQsImZpcnN0TmFtZSI6Iteg15nXmden15kiLCJsYXN0TmFtZSI6IteQ15PXmdeT16EiLCJyb2xlIjoiV1JJVEUifQ.157fyKPlPCFd1O0FQqD4x1Ci6BxyJJHF4jJS2d_OLOU`,
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
