import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rangeDisplay'
})
export class RangeDisplayPipe implements PipeTransform {

  transform(value: { price1: number | null, price2: number | null } | null): string {
    if (value) {
      const min = Math.min(value.price1 ?? 0, value.price2 ?? 10000);
      const max = Math.max(value.price1 ?? 0, value.price2 ?? 10000);
      return `${min} - ${max}`;
    }
    return '0 - 10000';
  }

}
