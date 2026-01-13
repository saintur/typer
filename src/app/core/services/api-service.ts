import { Injectable } from '@angular/core';
import {LessonItem} from '../../utils/helpers';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  protected baseUrl: string = environment.api_url;

  constructor(private http: HttpClient) {
  }

  getAllLessons(): Observable<LessonItem[]> {
    return this.http.get<LessonItem[]>(`${this.baseUrl}/category/lesson`);
  }
}
