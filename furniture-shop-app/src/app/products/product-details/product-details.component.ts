import { Component } from '@angular/core';
import { faStar as faSolidStar, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { ISlideInterface } from '../interfaces';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  solidStarIcon = faSolidStar;
  starIcon = faStar;
  circleIcon = faCircle;

  slides: ISlideInterface[] = [
    { url: 'assets/images/product-1.png' },
    { url: 'assets/images/product-2.png' },
    { url: 'assets/images/product-3.png' },
  ];
}
