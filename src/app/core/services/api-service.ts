import { Injectable } from '@angular/core';
import {ExerciseItem, LessonItem} from '../../utils/helpers';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from "./local-storage";

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  protected baseUrl: string = environment.api_url;

  constructor(private http: HttpClient,
              private readonly _localStorage: LocalStorage,) {
  }

  // Category
  getAllLessons(): Observable<LessonItem[]> {
    const headers = new HttpHeaders({
      Authorization: this._localStorage.getAccessToken() ? `Bearer ${this._localStorage.getAccessToken()}`: ``,
    });

    return this.http.get<LessonItem[]>(`${this.baseUrl}/v2/categories/lessons`, { headers } );
  }

  getSubLessons(id: number): Observable<LessonItem[]> {
    const headers = new HttpHeaders({
      Authorization: this._localStorage.getAccessToken() ? `Bearer ${this._localStorage.getAccessToken()}`: ``,
    });

    return this.http.get<LessonItem[]>(`${this.baseUrl}/v2/categories/lessons/${id}`, { headers } );
  }

  restartLesson(selectedLessonId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/v1/category/${selectedLessonId}/restart`, {}, { headers })
  }

  // exercise
  getExercise(lang: string, category: number): Observable<ExerciseItem[]> {
    return this.http.get<ExerciseItem[]>(`${this.baseUrl}/v1/exercise/${lang}/${category}`);
  }

  // exercises attemps
  exercisesAttempSave(data: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/v1/statustyping/save`, data, { headers })
  }
}
