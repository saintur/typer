import { TestBed } from '@angular/core/testing';

import { LocalStorage } from './local-storage';

describe('LocalStorage', () => {
  let service: LocalStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorage]
    });

    service = TestBed.inject(LocalStorage);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
  //
  // it('should set access and refresh tokens', () => {
  //   service.setTokens('access123', 'refresh123');
  //
  //   expect(localStorage.getItem('accessToken')).toBe('access123');
  //   expect(localStorage.getItem('refreshToken')).toBe('refresh123');
  // });
  //
  // it('should get access token', () => {
  //   localStorage.setItem('accessToken', 'access123');
  //
  //   const token = service.getAccessToken();
  //
  //   expect(token).toBe('access123');
  // });
  //
  // it('should get refresh token', () => {
  //   localStorage.setItem('refreshToken', 'refresh123');
  //
  //   const token = service.getFreshToken();
  //
  //   expect(token).toBe('refresh123');
  // });
  //
  // it('should clear tokens', () => {
  //   localStorage.setItem('accessToken', 'access123');
  //   localStorage.setItem('refreshToken', 'refresh123');
  //
  //   service.clearTokens();
  //
  //   expect(localStorage.getItem('accessToken')).toBeNull();
  //   expect(localStorage.getItem('refreshToken')).toBeNull();
  // });
  //
  // it('should return true when logged in', () => {
  //   localStorage.setItem('accessToken', 'access123');
  //
  //   const result = service.isLoggedIn();
  //
  //   expect(result).toBeTruthy();
  // });
  //
  // it('should return false when not logged in', () => {
  //   localStorage.removeItem('accessToken');
  //
  //   const result = service.isLoggedIn();
  //
  //   expect(result).toBeFalsy();
  // });
});
