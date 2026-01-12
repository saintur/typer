import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from 'rxjs';
import {LocalStorage} from './local-storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export interface User {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  birthday: string,
  gender: string;
  measureSpeed: string;
  enableSounds: boolean;
  keyboardType: string;
  sentenceSpaces: number;
  role: string;
}

export interface UserUpgrade {
  active: boolean;
  durationMonth: number;
  planName: string;
  expireAt: Date | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api: string =  environment.api_url;
  $User: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private _http: HttpClient,
              private readonly _localStorage: LocalStorage,) {}

  login(data: any): Observable<any> {
    return this._http.post<any>(`${this.api}/auth/authenticate`, data)
      .pipe(
        tap(res => {
          this._localStorage.setTokens(res.token, res.token);
        }),
        catchError(err => {
          console.error('error:', err);
          // Optionally show error to the user or rethrow
          return throwError(() => err);
        })
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
    return this._http.post<any>(`${this.api}/user/register`, data)
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

  fetchUserData(): void {
    if(this.isLoggedIn()) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
      });

      this._http.get<any>(`${this.api}/user/me`, {headers})
        .subscribe(res => {
          this.$User.next({
            firstname: res.firstname,
            lastname: res.lastname,
            birthday: res.birthday,
            username:res.username,
            email: res.email,
            gender: res.gender,
            measureSpeed: res.measureSpeed,
            enableSounds: res.enableSounds,
            keyboardType: res.keyboardType,
            sentenceSpaces: res.sentenceSpaces,
            role: res.role,
          });
        });
    }
  }

  fetchNotifications(): any {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this._http.get<any>(`${this.api}/user/notifications`, {headers});
  }

  changePassword(data: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this._http.post(`${this.api}/user/change-password`, data, { headers })
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

    return this._http.put(`${this.api}/user/change-profile`, value, { headers });
  }

  changeOptions(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });

    return this._http.put(`${this.api}/user/change-options`, value, { headers });
  }

  changeNotifications(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });

    return this._http.put(`${this.api}/user/change-notifications`, value, { headers });
  }

  getMembership() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this._http.get(`${this.api}/user/membership`, { headers });
  }

  getBillings() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });

    return this._http.get(`${this.api}/user/billings`, { headers });
  }
}
