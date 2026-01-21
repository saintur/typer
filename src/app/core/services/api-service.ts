import {Injectable} from '@angular/core';
import {ExerciseItem, LessonItem, UpgradePlan} from '../../utils/helpers';
import {catchError, Observable, of, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from "./local-storage";
import {CacheService} from './cache-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl: string = environment.api_url;

  constructor(private http: HttpClient,
              private cache: CacheService,
              private readonly _localStorage: LocalStorage,) {
  }

  // Category
  getAllLessons(): Observable<LessonItem[]> {
    const headers = new HttpHeaders({
      Authorization: this._localStorage.getAccessToken() ? `Bearer ${this._localStorage.getAccessToken()}` : ``,
    });

    return this.http.get<LessonItem[]>(`${this.baseUrl}/v2/categories/lessons`, {headers});
  }

  getSubLessons(id: number): Observable<LessonItem[]> {
    const key = `lessonsFor${id}`;
    if (!this.cache.has(key)) {
      const headers = new HttpHeaders({
        Authorization: this._localStorage.getAccessToken() ? `Bearer ${this._localStorage.getAccessToken()}` : ``,
      });

      return this.http.get<LessonItem[]>(`${this.baseUrl}/v2/categories/lessons/${id}`, {headers})
        .pipe(
          tap(lessons => this.cache.set<LessonItem[]>(key, lessons)),
          catchError(err => {
            this.cache.delete(key);
            throw err;
          })
        );
    }

    return of(this.cache.get<LessonItem[]>(key)!);
  }

  restartLesson(selectedLessonId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/v1/category/${selectedLessonId}/restart`, {}, {headers})
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
    return this.http.post(`${this.baseUrl}/v1/statustyping/save`, data, {headers});
  }

  sentContact(value: any) {
    return this.http.post(`${this.baseUrl}/v1/contactus`, value);
  }

  getUpgradePlans() {
    return this.http.get<UpgradePlan[]>(`${this.baseUrl}/v1/upgrade/plans`);
  }

  purchase(value: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._localStorage.getAccessToken()}`,
    });
    return this.http.post(`${this.baseUrl}/upgrade/purchase`, value, {headers});
  }

}
