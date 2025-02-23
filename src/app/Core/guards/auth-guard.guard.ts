import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  if (localStorage.getItem('token') != null) {
    return true;
  } else {
    // _Router.navigate('/MyDashboard');
    _Router.navigate('/signin');
    return false;
  }
};
