import { Directive, ElementRef, HostBinding, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

@Directive({
  selector: '[appLoading]'
})
export class LoadingDirective implements OnInit, OnChanges {

  @HostBinding("style.position")
  hostPosition: string = "relative";

  @Input() appLoading: boolean = false;

  uid: string = '';

  constructor(private targetEl: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.uid = "loading-container-" + uuidv4();

    const loadingContainer = this.renderer.createElement("div");
    this.renderer.setStyle(
      loadingContainer,
      "display",
      this.appLoading ? "flex" : "none"
    );
    this.renderer.setStyle(loadingContainer, "justify-content", "center");
    this.renderer.setStyle(loadingContainer, "align-items", "center");
    this.renderer.addClass(loadingContainer, this.uid);
    this.renderer.setStyle(loadingContainer, "position", "absolute");
    this.renderer.setStyle(loadingContainer, "top", "0");
    this.renderer.setStyle(loadingContainer, "left", "0");
    this.renderer.setStyle(loadingContainer, "background", "rgba(100, 100, 100, 0.2");
    this.renderer.setStyle(loadingContainer, "width", "100%");
    this.renderer.setStyle(loadingContainer, "height", "100%");

    // custom spinner -- start
    const spinnerContainer = this.renderer.createElement("div");
    this.renderer.addClass(spinnerContainer, "lds-facebook");
    const spinnerInnerDiv1 = this.renderer.createElement("div");
    const spinnerInnerDiv2 = this.renderer.createElement("div");
    const spinnerInnerDiv3 = this.renderer.createElement("div");

    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv1);
    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv2);
    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv3);

    this.renderer.appendChild(loadingContainer, spinnerContainer);
    // custom spinner -- end

    this.renderer.appendChild(this.targetEl.nativeElement, loadingContainer);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['appLoading']) {
      const container = this.targetEl.nativeElement;
      const div = container.children[1];
      if (div) {
        this.renderer.setStyle(
          div,
          "display",
          this.appLoading ? "flex" : "none"
        );
      }
    }
  }

}
