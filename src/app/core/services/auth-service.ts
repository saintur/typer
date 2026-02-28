import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, catchError, map, Observable, of, tap, throwError} from 'rxjs';
import {LocalStorage} from './local-storage';
import {User} from '../../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api: string =  environment.api_url;
  $User: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private _http: HttpClient,
              private readonly _localStorage: LocalStorage,) {}

  login(data: any): Observable<any> {
    return this._http.post<any>(`${this.api}/v1/auth/authenticate`, data)
      .pipe(
        tap(res => {
          this._localStorage.setTokens(res.token, res.token);
        }),
      )
  }

  isPremium$(): Observable<boolean> {
    return this.$User.pipe(
      map(u => !!u?.role)
    );
  }

  logout() {
    this._localStorage.clearTokens();
    this.$User.next(null);
  }

  signUp(data: any): Observable<any> {
    return this._http.post<any>(`${this.api}/v1/auth/register`, data)
      .pipe(
        tap(res => {
          this._localStorage.setTokens(res.accessToken, res.refreshToken);
          this.$User.next(res.user);
        }),
        catchError(err => {
          console.error('error:', err);
          // Optionally show error to the user or rethrow
          return throwError(() => err);
        })
      );
  }

  isLoggedIn(): boolean {
    // Implement your logic here
    return this._localStorage.isLoggedIn();
  }

  fetchUserData(): Observable<User|null> {
    if (!this.isLoggedIn()) {
      return of(null);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this._http.get<any>(`${this.api}/v1/user/me`, {headers}).pipe(
      tap(res => this.$User.next(res as User))
    );
  }

  fetchNotifications(): any {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this._http.get<any>(`${this.api}/v1/user/notifications`, {headers});
  }

  changePassword(data: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this._http.post(`${this.api}/v1/user/change-password`, data, {headers})
      .pipe(
        catchError(err => {
          console.error('error:', err);
          // Optionally show error to the user or rethrow
          return throwError(() => err);
        })
      );
  }

  changeProfile(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });

    return this._http.put(`${this.api}/v1/user/change-profile`, value, {headers});
  }

  changeOptions(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });

    return this._http.put(`${this.api}/v1/user/change-options`, value, {headers});
  }

  changeNotifications(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });

    return this._http.put(`${this.api}/v1/user/change-notifications`, value, {headers});
  }

  getMembership() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this._http.get(`${this.api}/v1/user/membership`, {headers});
  }

  getBillings() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });

    return this._http.get(`${this.api}/v1/user/billings`, {headers});
  }

  sendResetEmail(email: string) {
    return this._http.post(`${this.api}/v1/auth/fotgot-password`, { email });
  }

  passwordValidate(token: string) {
    return this._http.post(`${this.api}/v1/auth/password-validate`, { token });
  }

  passwordReset(data: any) {
    return this._http.post(`${this.api}/v1/auth/password-reset`, data);
  }
}
