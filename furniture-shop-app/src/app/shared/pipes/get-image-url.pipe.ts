import { Pipe, PipeTransform } from '@angular/core';
import { IImageEntry } from '../interfaces';

@Pipe({
  name: 'getImageUrl'
})
export class GetImageUrlPipe implements PipeTransform {

  transform(value: IImageEntry[]): string {
    return value[0].url;
  }

}
