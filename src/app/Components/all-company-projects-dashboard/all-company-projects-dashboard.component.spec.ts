import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCompanyProjectsDashboardComponent } from './all-company-projects-dashboard.component';

describe('AllCompanyProjectsDashboardComponent', () => {
  let component: AllCompanyProjectsDashboardComponent;
  let fixture: ComponentFixture<AllCompanyProjectsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCompanyProjectsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCompanyProjectsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
