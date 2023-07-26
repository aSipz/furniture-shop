import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces';

@Pipe({
  name: 'calcPrice'
})
export class CalcPricePipe implements PipeTransform {

  transform(value: IProduct & { cartCount: number }, decimalCount: number = 0): string {
    return (value.discountPrice! * value.cartCount).toFixed(decimalCount);
  }

}
