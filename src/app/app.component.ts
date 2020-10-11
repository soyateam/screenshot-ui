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

  constructor(private userService: UserService) {
    this.userService.login();
  }

  ngOnInit() {
    this.user = this.userService.currentUser;
  }
}
