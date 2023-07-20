import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

  transform(value: { _id: string, firstName: string, lastName: string }): string {
    return `${value.firstName} ${value.lastName}`;
  }

}
