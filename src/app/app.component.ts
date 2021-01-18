import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'screenshot-ui';
  isRedirected = false;
  user;
  service;

  constructor(private userService: UserService) {
    this.userService.login();
    this.service = this.userService;
  }

  ngOnInit() {
    this.user = this.userService.currentUser;
  }

  isExpired() {
    if (this.userService.expired() && !this.isRedirected) {
      this.isRedirected = true;
      window.location.href = environment.auth.loginURL;

      return true;
    } else {
      return false;
    }
  }
}
