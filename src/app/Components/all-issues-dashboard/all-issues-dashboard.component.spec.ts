import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIssuesDashboardComponent } from './all-issues-dashboard.component';

describe('AllIssuesDashboardComponent', () => {
  let component: AllIssuesDashboardComponent;
  let fixture: ComponentFixture<AllIssuesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllIssuesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIssuesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
