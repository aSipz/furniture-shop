import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-primary-btn',
  templateUrl: './primary-btn.component.html',
  styleUrls: ['./primary-btn.component.css']
})
export class PrimaryBtnComponent {

  buttonText = '';

  @Input()
  set text(name: string) {
    this.buttonText = name.toUpperCase();
  }
  get name(): string {
    return this.buttonText;
  }

  @Input() type: string = 'button';
  @Output() btnClick = new EventEmitter();
  @Input() isDisabled = false;
  @Input() btnClass: string = 'green';

  constructor() { }

  onClick(event: MouseEvent) {
    this.btnClick.emit(event);
  }
}
