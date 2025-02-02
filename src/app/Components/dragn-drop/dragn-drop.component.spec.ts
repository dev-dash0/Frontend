import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragnDropComponent } from './dragn-drop.component';

describe('DragnDropComponent', () => {
  let component: DragnDropComponent;
  let fixture: ComponentFixture<DragnDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragnDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragnDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
