import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/user/user.service';
import { LoaderService } from '../services/loader.service';
import { CartService } from 'src/app/cart/services/cart.service';

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
    private loaderService: LoaderService,
    private cartService: CartService,
    private router: Router
  ) { }


  logoutHandler() {
    this.loaderService.showLoader();
    this.userService.logout().subscribe({
      next: () => {
        this.loaderService.hideLoader();
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hideLoader();
        this.router.navigate(['/']);
      }
    });
  }
}
