import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { filter, tap } from 'rxjs';
import { CartService } from 'src/app/cart/services/cart.service';
import { routeMatchOptions } from 'src/app/shared/constants';

import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-header',
  animations: [
    // trigger('openClose', [
    //   state('open', style({
    //     transform: 'translateY(100%)',
    //     'z-index': 20,
    //   })),
    //   state('closed', style({
    //     transform: 'translateY(0%)',
    //     // 'z-index': -3
    //   })),
    //   transition('open => closed', [
    //     animate('0.5s 0s ease-in-out')
    //   ]),
    //   transition('closed => open', [
    //     animate('0.3s 0s ease-in-out')
    //   ]),
    // ]),
    trigger('openClose', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('0.4s 0s ease-in-out', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('0.4s 0s ease-in-out', style({
          opacity: 0
        }))
      ]),
    ]),
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  timer: { [key: string]: ReturnType<typeof setTimeout> | null } = {
    profile: null,
    cart: null
  };

  isOpen: { [key: string]: boolean } = {
    profile: false,
    cart: false
  };

  readonly routeMatchOptions: IsActiveMatchOptions = routeMatchOptions;

  constructor(
    private userService: UserService,
    private cartService: CartService
  ) {
    this.cartService.cart$.pipe(
      filter(c => c !== null && c.length !== 0),
      tap(c => {
        this.show('cart');
        this.hideWithDelay('cart', 2000);
      })
    ).subscribe()
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get isAdmin() {
    return this.userService.isAdmin;
  }

  show(submenu: string) {
    this.stayOpened(submenu);

    if (!this.isOpen[submenu]) {
      this.isOpen[submenu] = true;
    }

    Object.keys(this.isOpen)
      .filter(k => k !== submenu)
      .forEach(k => this.hide(k));

  }

  hideWithDelay(submenu: string, delay?: number) {
    this.timer[submenu] = setTimeout(() => {
      this.isOpen[submenu] = false;
    }, delay ? delay : 500);
  }

  hide(submenu: string) {
    this.isOpen[submenu] = false;
  }

  stayOpened(submenu: string) {
    if (this.timer[submenu]) {
      clearInterval(this.timer[submenu] as (string | number | NodeJS.Timeout | undefined));
      this.timer[submenu] = null;
    }
  }

}