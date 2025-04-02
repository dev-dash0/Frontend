import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectsCardComponent } from './all-projects-card.component';

describe('AllProjectsCardComponent', () => {
  let component: AllProjectsCardComponent;
  let fixture: ComponentFixture<AllProjectsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProjectsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProjectsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
