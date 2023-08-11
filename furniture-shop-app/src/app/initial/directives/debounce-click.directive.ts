import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnDestroy, OnInit {

  @Input() debounceTime = 500;
  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject();
  private sub!: Subscription;

  constructor() { }

  ngOnInit() {
    this.sub = this.clicks.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
    ).subscribe(e => this.debounceClick.emit(e));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
