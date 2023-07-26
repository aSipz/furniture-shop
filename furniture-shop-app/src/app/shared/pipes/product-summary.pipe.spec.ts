import { ProductSummaryPipe } from './product-summary.pipe';

describe('ProductSummaryPipe', () => {
  it('create an instance', () => {
    const pipe = new ProductSummaryPipe();
    expect(pipe).toBeTruthy();
  });
});
