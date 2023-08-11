import { Component } from '@angular/core';

import { UserService } from 'src/app/user/user.service';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/+store/actions';

@Component({
  selector: 'app-profile-submenu',
  templateUrl: './profile-submenu.component.html',
  styleUrls: ['./profile-submenu.component.css']
})
export class ProfileSubmenuComponent {

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  constructor(
    private userService: UserService,
    private store: Store,
  ) { }

  logoutHandler() {
    this.store.dispatch(logout());
  }
}
