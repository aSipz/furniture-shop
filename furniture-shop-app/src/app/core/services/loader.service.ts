import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isVisible = false;

  constructor() { }

  showLoader(): void {
    this.isVisible = true;
  }

  hideLoader() {
    this.isVisible = false;
  }
}
