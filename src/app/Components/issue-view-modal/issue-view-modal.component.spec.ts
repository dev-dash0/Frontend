import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueViewModalComponent } from './issue-view-modal.component';

describe('IssueViewModalComponent', () => {
  let component: IssueViewModalComponent;
  let fixture: ComponentFixture<IssueViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
