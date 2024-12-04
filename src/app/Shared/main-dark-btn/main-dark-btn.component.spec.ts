import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDarkBtnComponent } from './main-dark-btn.component';

describe('MainDarkBtnComponent', () => {
  let component: MainDarkBtnComponent;
  let fixture: ComponentFixture<MainDarkBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDarkBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDarkBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
