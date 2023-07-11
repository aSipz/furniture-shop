import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  animations: [
    trigger('openClose', [
      state('open', style({
        transform: 'translateY(100%)',
        'z-index': 0,
      })),
      state('closed', style({
        transform: 'translateY(0%)',
        // 'z-index': -3
      })),
      transition('open => closed', [
        animate('0.5s 0s ease-in-out')
      ]),
      transition('closed => open', [
        animate('0.3s 0s ease-in-out')
      ]),
    ]),
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  timer: ReturnType<typeof setTimeout> | null = null;

  isOpen = false;

  constructor() { }

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