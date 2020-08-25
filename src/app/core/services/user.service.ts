import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { IUser, ROLE } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginURL: string = environment.auth.loginURL;
  private logoutURL: string = environment.auth.logoutURL;
  private cookieName: string = environment.auth.cookieTokenName;

  constructor(private cookieService: CookieService) { }

  public get isUserCanWrite(): boolean {
    if (!this.currentUser) {
      this.login();
      return false;
    }
    const role = this.currentUser.role;
    return role === ROLE.WRITE;
  }

  login() {
    // if (!this.currentUser && !this.cookieService.get(this.cookieName)) {
    //   window.location.href = this.loginURL;
    // }

    this.cookieService.set(this.cookieName, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InQyMzQ1ODc4OUBqZWxsby5jb20iLCJhZGZzSWQiOiJ0MjM0NTg3ODlAamVsbG8uY29tIiwiZ2VuZXNpc0lkIjoiNWU1Njg4MzI0MjAzZmM0MDA0MzU5MWFhIiwibmFtZSI6eyJmaXJzdE5hbWUiOiLXoNeZ15nXp9eZIiwibGFzdE5hbWUiOiLXkNeT15nXk9ehIn0sImRpc3BsYXlOYW1lIjoidDIzNDU4Nzg5QGplbGxvLmNvbSIsInByb3ZpZGVyIjoiR2VuZXNpcyIsImVudGl0eVR5cGUiOiJkaWdpbW9uIiwiY3VycmVudFVuaXQiOiJuaXRybyB1bml0IiwiZGlzY2hhcmdlRGF5IjoiMjAyMi0xMS0zMFQyMjowMDowMC4wMDBaIiwicmFuayI6Im1lZ2EiLCJqb2IiOiLXqNeV16bXlyIsInBob25lTnVtYmVycyI6WyIwNTItMTIzNDU2NyJdLCJhZGRyZXNzIjoi16jXl9eV15Eg15TXntee16rXp9eZ150gMzQiLCJwaG90byI6bnVsbCwianRpIjoiN2ZmMTgyZTEtZmM1YS00NjdjLWE2MDAtZDkwMjIyMzEwNTJhIiwiaWF0IjoxNTk4MzM5Mzg0LCJleHAiOjE2MDA5MzEzODQsImZpcnN0TmFtZSI6Iteg15nXmden15kiLCJsYXN0TmFtZSI6IteQ15PXmdeT16EiLCJyb2xlIjoiV1JJVEUifQ.157fyKPlPCFd1O0FQqD4x1Ci6BxyJJHF4jJS2d_OLOU')
  }

  logout() {
    if (this.currentUser) {
      this.cookieService.delete(this.cookieName);
      window.location.href = this.logoutURL;
    }
  }

  expired() {
    const token = this.cookieService.get(this.cookieName);
    const exp = this.parseJwt(token).exp;
    if (Date.now() >= exp * 1000) return true;
    return false;
  }

  public get currentUser(): IUser {
    const token = this.cookieService.get(this.cookieName);
    if (token) {
      const decodedData = this.parseJwt(token);
      return decodedData as IUser;
    }

    this.login();
  }

  private parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
