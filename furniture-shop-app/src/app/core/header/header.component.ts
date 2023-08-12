import { trigger, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { IsActiveMatchOptions, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { pairwise, tap } from 'rxjs';
import { isAdmin, isLoggedIn } from 'src/app/+store/selectors';

import { CartService } from 'src/app/cart/services/cart.service';
import { routeMatchOptions } from 'src/app/initial/constants';
import { ICartProduct } from 'src/app/initial/interfaces';

@Component({
  selector: 'app-header',
  animations: [
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

  private timer: { [key: string]: ReturnType<typeof setTimeout> | null } = {
    profile: null,
    cart: null,
    newEntry: null
  };

  isOpen: { [key: string]: boolean } = {
    profile: false,
    cart: false
  };

  cart: [ICartProduct[] | null, ICartProduct[] | null] = [null, null];
  newEntry = false;

  currentRoute: string = '';

  readonly routeMatchOptions: IsActiveMatchOptions = routeMatchOptions;

  constructor(
    private cartService: CartService,
    private router: Router,
    private store: Store,
  ) {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });

    this.cartService.cart$.pipe(
      pairwise(),
      tap(value => {

        this.cart = value;

        if (value[1] !== null && value[1].length !== 0 && !this.currentRoute.startsWith('/cart')) {
          this.show('cart');
          this.hideWithDelay('cart', 2000);
          this.newEntry = true;

          if (this.timer['newEntry']) {
            clearInterval(this.timer['newEntry']);
          }
          this.timer['newEntry'] = setTimeout(() => {
            this.newEntry = false;
          }, 2000);
        }

      })
    ).subscribe();

  }

  isLoggedIn$ = this.store.select(isLoggedIn);
  isAdmin$ = this.store.select(isAdmin);

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