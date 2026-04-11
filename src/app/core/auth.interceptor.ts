import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LocalStorage } from './services/local-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(LocalStorage);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        storage.clearTokens();
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    })
  );
};
