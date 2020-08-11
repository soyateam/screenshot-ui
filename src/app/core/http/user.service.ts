import { Injectable } from '@angular/core';
import { CookieService } from "ngx-cookie-service";

import { IUser } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authenticationURL: string = environment.loginURL;

  constructor(private cookieService: CookieService) { }

  login() {
    if (!this.currentUser && !this.cookieService.get(environment.authenticationToken)) {
      window.location.href = environment.loginURL;
      this.currentUser;
    }
  }

  logout() {
    if (this.currentUser) {
      this.cookieService.delete(environment.authenticationToken);
      window.location.href = environment.logoutURL;
    }
  }

  expired() {
    const token = this.cookieService.get(environment.authenticationToken);
    const exp = this.parseJwt(token).exp;
    if (Date.now() >= exp * 1000) return true;
    return false;
  }

  public get currentUser(): IUser {
    const token = this.cookieService.get(environment.authenticationToken);
    if (token) {
      const decodedData = this.parseJwt(token);
      return decodedData as IUser;
    }

    return null;
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
