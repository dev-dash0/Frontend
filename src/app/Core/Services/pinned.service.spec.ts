import { TestBed } from '@angular/core/testing';

import { PinnedService } from './pinned.service';

describe('PinnedService', () => {
  let service: PinnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinnedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
