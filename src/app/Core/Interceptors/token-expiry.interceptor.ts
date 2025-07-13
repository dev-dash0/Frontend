import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../Services/Auth.service';

export const tokenExpiryInterceptor: (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => Observable<HttpEvent<any>> = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  // ✅ Check for expiration
  if (token && isTokenExpired(token)) {
    console.warn('🔴 Token expired - calling logout endpoint');

    authService.Logout({ token }).subscribe({
      next: () => authService.logoutAndRedirect(),
      error: () => authService.logoutAndRedirect(),
    });

    return throwError(() => new Error('Token expired'));
  }

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.logoutAndRedirect();
      }
      return throwError(() => error);
    })
  );
};

// ✅ Helper
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now > expiry;
  } catch (e) {
    console.error('⚠️ Invalid token format:', e);
    return true;
  }
}
