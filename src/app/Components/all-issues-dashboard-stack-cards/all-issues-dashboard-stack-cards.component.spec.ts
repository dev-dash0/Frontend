import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIssuesDashboardStackCardsComponent } from './all-issues-dashboard-stack-cards.component';

describe('AllIssuesDashboardStackCardsComponent', () => {
  let component: AllIssuesDashboardStackCardsComponent;
  let fixture: ComponentFixture<AllIssuesDashboardStackCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllIssuesDashboardStackCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIssuesDashboardStackCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
