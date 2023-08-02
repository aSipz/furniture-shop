import { Pipe, PipeTransform } from '@angular/core';
import { IRating } from '../interfaces';

@Pipe({
  name: 'calcRating'
})
export class CalcRatingPipe implements PipeTransform {

  transform(value: IRating[] | string[] | undefined, round: number = 1): number | null {
    const ratings = value as IRating[];
    if (ratings.length === 0) {
      return 0
    }
    const inv = 1 / round;
    const rating = ratings.reduce((acc, curr) => {
      acc += curr.rating;
      return acc;
    }, 0) / ratings.length;
    return Math.round(rating * inv) / inv;
  }

}
