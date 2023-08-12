import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { logout } from 'src/app/+store/actions/userActions';
import { isLoggedIn } from 'src/app/+store/selectors';

@Component({
  selector: 'app-profile-submenu',
  templateUrl: './profile-submenu.component.html',
  styleUrls: ['./profile-submenu.component.css']
})
export class ProfileSubmenuComponent {

  isLoggedIn$ = this.store.select(isLoggedIn);

  constructor(
    private store: Store,
  ) { }

  logoutHandler() {
    this.store.dispatch(logout());
  }
}
