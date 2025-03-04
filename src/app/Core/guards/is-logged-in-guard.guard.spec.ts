import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isLoggedInGuardGuard } from './is-logged-in-guard.guard';

describe('isLoggedInGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isLoggedInGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
