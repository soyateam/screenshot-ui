import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { SnackBarService } from '../services/snackbar.service';
import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private snackBarService: SnackBarService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(environment.httpRequestRetryAmount),
      catchError((error: HttpErrorResponse) => {
        // status 401 handled in auth.interceptor
        if (error.status !== 401) {
          let message: string;

          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = `status: ${error.status}: ${error.statusText}`;
          }

          this.snackBarService.open(message, 'close');
        }
        return throwError(error);
      })
    );
  }
}
