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

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private snackBarService: SnackBarService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(environment.httpRequestRetryAmount),
      catchError((error: HttpErrorResponse) => {

        // status 401 handled in auth.interceptor
        if (error.status !== 401) {
          const message: string = `status: ${error.status}: ${error.statusText}`;
          const action: string = 'close';
          
          this.snackBarService.open(message, action);
        }
        return throwError(error);
      })
    );
  }
}
