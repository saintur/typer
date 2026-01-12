import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {LevelItem, WallOfFame} from '../../utils/utils';
import {Observable} from 'rxjs';
import {LocalStorage} from './local-storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  protected baseUrl: string = environment.api_url;

  constructor(private http: HttpClient,
              private readonly _localStorage: LocalStorage,) {
  }

  sentContact(body: any) {
    return this.http.post(`${environment.api_url}/contactus`, body)
  }

  getWallOfFame(): Observable<WallOfFame> {
    return this.http.get<WallOfFame>(`${environment.api_url}/contactus`)
  }

  getLevel(): Observable<LevelItem> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.get<LevelItem>(`${environment.api_url}/user-level`, { headers })
  }
}
