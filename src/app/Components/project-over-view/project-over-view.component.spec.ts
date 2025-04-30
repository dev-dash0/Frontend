import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverViewComponent } from './project-over-view.component';

describe('ProjectOverViewComponent', () => {
  let component: ProjectOverViewComponent;
  let fixture: ComponentFixture<ProjectOverViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOverViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectOverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
