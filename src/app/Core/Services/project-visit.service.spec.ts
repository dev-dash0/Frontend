import { TestBed } from '@angular/core/testing';

import { ProjectVisitService } from './project-visit.service';

describe('ProjectVisitService', () => {
  let service: ProjectVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
