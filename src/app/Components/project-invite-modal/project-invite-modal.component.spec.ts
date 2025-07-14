import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInviteModalComponent } from './project-invite-modal.component';

describe('ProjectInviteModalComponent', () => {
  let component: ProjectInviteModalComponent;
  let fixture: ComponentFixture<ProjectInviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectInviteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectInviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
