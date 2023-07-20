import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReviewComponent } from './add-edit-review.component';

describe('AddEditReviewComponent', () => {
  let component: AddEditReviewComponent;
  let fixture: ComponentFixture<AddEditReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditReviewComponent]
    });
    fixture = TestBed.createComponent(AddEditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
