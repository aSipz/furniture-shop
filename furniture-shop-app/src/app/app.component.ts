import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivationStart, ChildrenOutletContexts } from '@angular/router';

import { filter, map } from 'rxjs';
import { slideInAnimation } from './initial/animations';
import { Store } from '@ngrx/store';
import { getCounter } from './+store/selectors';
import { increment, setCounter } from './+store/actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'furni.SHOP';

  counter$ = this.store.select(getCounter);

  constructor(
    private router: Router,
    private pageTitle: Title,
    private contexts: ChildrenOutletContexts,
    private store: Store
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

  incrementHandler() {
    this.store.dispatch(increment());
  }

  setCounterHandler(newValue: number) {
    this.store.dispatch(setCounter({ counter: newValue }));
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
