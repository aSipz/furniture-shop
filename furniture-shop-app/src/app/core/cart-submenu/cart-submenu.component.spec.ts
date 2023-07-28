import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSubmenuComponent } from './cart-submenu.component';

describe('CartSubmenuComponent', () => {
  let component: CartSubmenuComponent;
  let fixture: ComponentFixture<CartSubmenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartSubmenuComponent]
    });
    fixture = TestBed.createComponent(CartSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
