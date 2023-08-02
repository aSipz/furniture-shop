import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

  transform(value: number, digits: number = 2): string {
    return '$' + value.toFixed(digits);
  }

}
