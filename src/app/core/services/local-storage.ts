import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorage {

  constructor() { }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getFreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken;
  }

  clearTokens() {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    //localStorage.clear();
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return true;
    }
    return false;
  }
}
