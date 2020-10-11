import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { IUser, ROLE } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginURL: string = environment.auth.loginURL;
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
    if (!this.cookieService.get(this.cookieName) || this.expired()) {
      window.location.href = this.loginURL;
    }
  }

  expired() {
    const token = this.cookieService.get(this.cookieName);
    const exp = this.parseJwt(token).exp;
    if (Date.now() >= exp * 1000) {
      return true;
    }

    return false;
  }

  public get currentUser(): IUser {
    const token = this.cookieService.get(this.cookieName);

    if (!token) { throw new Error('user is not authorized'); }

    const decodedData = this.parseJwt(token);
    return decodedData as IUser;
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
