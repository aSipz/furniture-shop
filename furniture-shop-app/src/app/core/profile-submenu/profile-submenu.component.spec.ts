import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSubmenuComponent } from './profile-submenu.component';

describe('ProfileSubmenuComponent', () => {
  let component: ProfileSubmenuComponent;
  let fixture: ComponentFixture<ProfileSubmenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSubmenuComponent]
    });
    fixture = TestBed.createComponent(ProfileSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
