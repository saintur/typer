import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { LocalStorage } from './services/local-storage';
import { AuthService } from './services/auth-service';

// Module-level so concurrent 401s across requests share one in-flight refresh call.
let refresh$: Observable<string> | null = null;

const AUTH_ENDPOINTS = ['/auth/authenticate', '/auth/register', '/auth/refresh-token'];

function withAuthHeader(req: HttpRequest<unknown>, accessToken: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
}

function getRefreshedAccessToken(authService: AuthService, storage: LocalStorage): Observable<string> {
  if (!refresh$) {
    const refreshToken = storage.getFreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    refresh$ = authService.refreshToken(refreshToken).pipe(
      map(res => res.accessToken),
      shareReplay(1),
      finalize(() => { refresh$ = null; }),
    );
  }

  return refresh$;
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

      return getRefreshedAccessToken(authService, storage).pipe(
        catchError(refreshErr => {
          storage.clearTokens();
          router.navigateByUrl('/login');
          return throwError(() => refreshErr);
        }),
        /*
         * Only errors from the refresh call itself are caught above and treated
         * as a logout. A failure of the retried request below (e.g. an unrelated
         * 500, or a permission error even with a fresh token) must NOT be
         * misclassified as an auth failure — it propagates to the caller as-is.
         */
        switchMap(token => next(withAuthHeader(req, token))),
      );
    })
  );
};
