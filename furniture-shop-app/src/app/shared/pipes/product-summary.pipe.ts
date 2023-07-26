import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces';

@Pipe({
  name: 'productSummary'
})
export class ProductSummaryPipe implements PipeTransform {

  transform(value: {
    _id: string;
    count: number;
    productId: string | IProduct
  }): string {
    const product = value.productId as IProduct | null;
    if (!product) {
      return `removed product x ${value.count}`
    }
    return `${product.name} x ${value.count}`;
  }

}
