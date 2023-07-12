import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';

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

  timer: ReturnType<typeof setTimeout> | null = null;

  isOpen = false;

  constructor(private userService: UserService) { }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get isAdmin() {
    return this.userService.isAdmin;
  }

  show() {
    this.stayOpened();

    if (!this.isOpen) {
      this.isOpen = true;
    }

  }

  hideWithDelay() {
    this.timer = setTimeout(() => {
      this.isOpen = false;
    }, 500);
  }

  hide() {
    this.isOpen = false;
  }

  stayOpened() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

}