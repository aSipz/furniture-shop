import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

import { AnimationType, fadeIn, fadeOut, flipIn, flipOut, jackIn, jackOut, scaleIn, scaleOut } from './image-slider.animations';
import { trigger, transition, useAnimation } from '@angular/animations';
import { IImageEntry } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
  animations: [
    trigger("slideAnimation", [
      /* scale */
      transition("void => scale", [
        useAnimation(scaleIn, { params: { time: "500ms" } })
      ]),
      transition("scale => void", [
        useAnimation(scaleOut, { params: { time: "500ms" } })
      ]),

      /* fade */
      transition("void => fade", [
        useAnimation(fadeIn, { params: { time: "500ms" } })
      ]),
      transition("fade => void", [
        useAnimation(fadeOut, { params: { time: "500ms" } })
      ]),

      /* flip */
      transition("void => flip", [
        useAnimation(flipIn, { params: { time: "500ms" } })
      ]),
      transition("flip => void", [
        useAnimation(flipOut, { params: { time: "500ms" } })
      ]),

      /* JackInTheBox */
      transition("void => jackInTheBox", [
        useAnimation(jackIn, { params: { time: "700ms" } })
      ]),
      transition("jackInTheBox => void", [
        useAnimation(jackOut, { params: { time: "700ms" } })
      ])
    ])
  ]
})
export class ImageSliderComponent implements OnDestroy, OnInit, OnChanges {
  @Input() slides: IImageEntry[] = [];
  @Input() changeInterval: number = 3000;
  @Input() animationType: string = AnimationType.Scale;

  currentIndex: number = 0;
  imageLoading: boolean[] = [];
  timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.resetTimer();
  }

  ngOnChanges(changes: SimpleChanges) {
    const current: SimpleChange = changes['slides'];

    if (current?.currentValue) {
      this.slides = current.currentValue;
      this.imageLoading = this.slides.map(e => true);
      this.currentIndex = 0;
    }

  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }

  resetTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => this.goToNext(), this.changeInterval);
  }

  onEnter() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onLeave() {
    this.resetTimer();
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.slides.length - 1
      : this.currentIndex - 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.resetTimer();
    this.currentIndex = slideIndex;
  }

  onImageLoad(index: number) {
    console.log('load');
    
    this.imageLoading[index] = false;
  }

}
