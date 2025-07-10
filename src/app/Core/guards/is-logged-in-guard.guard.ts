import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// export const isLoggedInGuardGuard: CanActivateFn = (route, state) => {
//   const _Router = inject(Router);
//   if (typeof window !== 'undefined' && localStorage.getItem('token') != null) {
//     _Router.navigate(['/MyDashboard']);
//     return false;
//   } else {
//     return true;
//   }
// };

export const isLoggedInGuardGuard: CanActivateFn = () => {
  const router = inject(Router);

  // ✅ Check if we're in the browser
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      // If token exists → redirect to dashboard
      return router.createUrlTree(['/MyDashboard']);
    }
  }

  // If not logged in or running in SSR → allow access to signin/signup
  return true;
};

