import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { LocalStorage } from './services/local-storage';
import { AuthService } from './services/auth-service';

// Module-level (shared across all requests) so concurrent 401s share one refresh call.
let isRefreshing = false;
const refreshedAccessToken$ = new BehaviorSubject<string | null>(null);

const AUTH_ENDPOINTS = ['/auth/authenticate', '/auth/register', '/auth/refresh-token'];

function withAuthHeader(req: HttpRequest<unknown>, accessToken: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(LocalStorage);
  const authService = inject(AuthService);

  const isAuthEndpoint = AUTH_ENDPOINTS.some(path => req.url.includes(path));

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401 || isAuthEndpoint) {
        return throwError(() => err);
      }

      const refreshToken = storage.getFreshToken();
      if (!refreshToken) {
        storage.clearTokens();
        router.navigateByUrl('/login');
        return throwError(() => err);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshedAccessToken$.next(null);

        return authService.refreshToken(refreshToken).pipe(
          switchMap(res => {
            isRefreshing = false;
            refreshedAccessToken$.next(res.accessToken);
            return next(withAuthHeader(req, res.accessToken));
          }),
          catchError(refreshErr => {
            isRefreshing = false;
            storage.clearTokens();
            router.navigateByUrl('/login');
            return throwError(() => refreshErr);
          })
        );
      }

      // A refresh is already in flight for another request — wait for it, then retry.
      return refreshedAccessToken$.pipe(
        filter((token): token is string => token !== null),
        take(1),
        switchMap(token => next(withAuthHeader(req, token)))
      );
    })
  );
};
