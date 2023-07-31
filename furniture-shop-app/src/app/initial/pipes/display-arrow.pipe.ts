import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayArrow'
})
export class DisplayArrowPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (value.startsWith('-')) {
      return value.slice(1) + ' ↓';
    }

    return value + ' ↑';
  }

}
