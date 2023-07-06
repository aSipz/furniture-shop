import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivationStart } from '@angular/router';

import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'furni.SHOP';

  constructor(
    private router: Router,
    private pageTitle: Title
  ) {

    this.router.events.pipe(
      filter((e): e is ActivationStart => e instanceof ActivationStart),
      map(e => e.snapshot.data['title'])
    ).subscribe((routeTitle) => {
      let title = this.title;
      if (routeTitle) {
        title += ` | ${routeTitle}`;
      }
      this.pageTitle.setTitle(title);
    });

  }
}
