import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectsDashboardComponent } from './all-projects-dashboard.component';

describe('AllProjectsDashboardComponent', () => {
  let component: AllProjectsDashboardComponent;
  let fixture: ComponentFixture<AllProjectsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProjectsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProjectsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
