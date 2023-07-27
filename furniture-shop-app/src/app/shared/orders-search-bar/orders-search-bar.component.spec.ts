import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSearchBarComponent } from './orders-search-bar.component';

describe('OrdersSearchBarComponent', () => {
  let component: OrdersSearchBarComponent;
  let fixture: ComponentFixture<OrdersSearchBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdersSearchBarComponent]
    });
    fixture = TestBed.createComponent(OrdersSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
