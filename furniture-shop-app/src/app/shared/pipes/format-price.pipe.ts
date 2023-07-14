import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

  transform(value: number, digits: number = 2): string {
    return '$' + value.toFixed(digits);
  }

}

// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'shorten'
// })
// export class ShortenPipe implements PipeTransform {

//   transform(value: string, maxCount: number = 25): string {
//     return value.substring(0, maxCount) + (value.length > 25 ? '...' : '');
//   }

// }
