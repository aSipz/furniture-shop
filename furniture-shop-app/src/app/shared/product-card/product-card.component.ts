import { Component, Input } from '@angular/core';
import { IProduct } from '../interfaces';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input() product!: IProduct;
}
