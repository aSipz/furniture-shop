import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces';

@Pipe({
  name: 'calcPrice'
})
export class CalcPricePipe implements PipeTransform {

  transform(value: IProduct & { cartCount: number }): number {
    return value.discountPrice! * value.cartCount;
  }

}
