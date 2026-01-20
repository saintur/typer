import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  get<T>(key: string): T | null {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  set<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  delete(key: string) {
    sessionStorage.removeItem(key);
  }

  has(key: string) {
    return sessionStorage.getItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}
