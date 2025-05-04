import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUsersToIssueComponent } from './assign-users-to-issue.component';

describe('AssignUsersToIssueComponent', () => {
  let component: AssignUsersToIssueComponent;
  let fixture: ComponentFixture<AssignUsersToIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignUsersToIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignUsersToIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
