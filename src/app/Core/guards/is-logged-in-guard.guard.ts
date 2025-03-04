import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedInGuardGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router)
  if (localStorage.getItem('token') != null) {
    _Router.navigate(['/MyDashboard']);
    return false;
  } else {

    return true;
  }
};
