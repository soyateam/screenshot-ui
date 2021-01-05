import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'screenshot-ui';
  user;
  service;

  constructor(private userService: UserService) {
    this.userService.login();
    this.service = this.userService;
  }

  ngOnInit() {
    this.user = this.userService.currentUser;
  }
}
